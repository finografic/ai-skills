import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';

interface Skill {
  name: string;
  description: string;
  filename: string;
  filepath: string;
  content: string;
}

function expandPath(p: string): string {
  if (p.startsWith('~/')) {
    return path.join(os.homedir(), p.slice(2));
  }
  return p;
}

/**
 * Get the native Copilot prompts directory for the current OS
 */
function getCopilotPromptsDir(): string {
  const platform = os.platform();

  if (platform === 'darwin') {
    // macOS
    return path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'prompts');
  } else if (platform === 'win32') {
    // Windows
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'Code', 'User', 'prompts');
  } else {
    // Linux
    return path.join(os.homedir(), '.config', 'Code', 'User', 'prompts');
  }
}

function parseSkillFile(filepath: string): Skill | null {
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const filename = path.basename(filepath);

    // Parse YAML frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;

    const frontmatter = match[1];
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

    return {
      name: nameMatch?.[1] || filename,
      description: descMatch?.[1] || '',
      filename,
      filepath,
      content,
    };
  } catch {
    return null;
  }
}

function loadSkills(): Skill[] {
  const config = vscode.workspace.getConfiguration('ai-skills');
  const skillsPath = expandPath(config.get<string>('skillsPath') || '~/ai-skills/skills');

  if (!fs.existsSync(skillsPath)) {
    vscode.window.showErrorMessage(`Skills directory not found: ${skillsPath}`);
    return [];
  }

  const files = fs
    .readdirSync(skillsPath)
    .filter((f) => f.endsWith('.skill.md'))
    .sort();

  const skills: Skill[] = [];
  for (const file of files) {
    const skill = parseSkillFile(path.join(skillsPath, file));
    if (skill) skills.push(skill);
  }

  return skills;
}

function getSkillBody(content: string): string {
  // Strip YAML frontmatter, return just the markdown body
  const match = content.match(/^---\n[\s\S]*?\n---\n*([\s\S]*)$/);
  return match ? match[1].trim() : content;
}

function getControlDirectives(): string {
  // Key directives only - one line each
  const essentials = [
    'Be concise. Sacrifice grammar for brevity.',
    'Simple tasks → act immediately.',
    'Complex tasks → PLAN → PAUSE → PROCEED.',
    'No long explanations. No asking permission for obvious tasks.',
  ];

  return essentials.join(' ');
}

function buildSkillPayload(skills: Skill[], selected: Skill): string {
  const config = vscode.workspace.getConfiguration('ai-skills');
  const includeControl = config.get<boolean>('alwaysIncludeControl') ?? true;

  // Get skill body (no YAML frontmatter)
  const skillBody = getSkillBody(selected.content);

  // Build clean payload
  let payload = '';

  // Minimal skill header
  payload += `**⚡ ${selected.name}**\n\n`;

  // Skill content
  payload += `${skillBody}\n\n`;

  // Control directives at the end (less visually intrusive)
  if (includeControl && !selected.filename.startsWith('00-')) {
    const controlSkill = skills.find((s) => s.filename.startsWith('00-'));
    if (controlSkill) {
      payload += `---\n_${getControlDirectives()}_\n`;
    }
  }

  return payload;
}

async function selectSkill(): Promise<{ payload: string; skill: Skill } | undefined> {
  const skills = loadSkills();
  if (skills.length === 0) {
    vscode.window.showErrorMessage('No skills found');
    return;
  }

  // Filter out control skill from picker (it's auto-included)
  const pickableSkills = skills.filter((s) => !s.filename.startsWith('00-'));

  const items = pickableSkills.map((s) => ({
    label: s.name,
    description: s.filename,
    detail: s.description,
    skill: s,
  }));

  const picked = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a skill to load',
    matchOnDescription: true,
    matchOnDetail: true,
  });

  if (!picked) return;

  const payload = buildSkillPayload(skills, picked.skill);
  return { payload, skill: picked.skill };
}

export function activate(context: vscode.ExtensionContext) {
  // Command: Load skill to clipboard
  const loadCmd = vscode.commands.registerCommand('ai-skills.load', async () => {
    const result = await selectSkill();
    if (!result) return;

    await vscode.env.clipboard.writeText(result.payload);
    vscode.window.showInformationMessage(`✅ Skill "${result.skill.name}" copied to clipboard`);
  });

  // Command: Load skill and open Copilot (compose mode - pre-fill without sending)
  const loadToCopilotCmd = vscode.commands.registerCommand('ai-skills.loadToCopilot', async () => {
    const result = await selectSkill();
    if (!result) return;

    // Open chat with pre-filled skill content (isPartialQuery prevents auto-send!)
    try {
      await vscode.commands.executeCommand('workbench.action.chat.open', {
        query: result.payload,
        isPartialQuery: true, // ← This prevents auto-send!
      });
      vscode.window.showInformationMessage(`⚡ ${result.skill.name} loaded — add context and send`);
    } catch {
      // Fallback to clipboard if the command fails
      await vscode.env.clipboard.writeText(result.payload);
      await vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
      vscode.window.showInformationMessage(
        `⚡ ${result.skill.name} ready — Cmd+V to paste, add context, then send`,
      );
    }
  });

  // Command: Sync skills to native Copilot prompts directory
  const syncToCopilotCmd = vscode.commands.registerCommand('ai-skills.syncToCopilot', async () => {
    const skills = loadSkills();
    if (skills.length === 0) {
      vscode.window.showErrorMessage('No skills found to sync');
      return;
    }

    const copilotDir = getCopilotPromptsDir();

    // Ensure directory exists
    if (!fs.existsSync(copilotDir)) {
      fs.mkdirSync(copilotDir, { recursive: true });
    }

    // Filter out control skill - don't sync as standalone
    const syncableSkills = skills.filter((s) => !s.filename.startsWith('00-'));

    let synced = 0;
    let errors: string[] = [];

    for (const skill of syncableSkills) {
      try {
        // Convert .skill.md to .prompt.md for Copilot
        const targetName = skill.filename.replace('.skill.md', '.prompt.md');
        const targetPath = path.join(copilotDir, targetName);

        // Remove existing file/symlink if present
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
        }

        // Try symlink first, fall back to copy (Windows without dev mode)
        try {
          fs.symlinkSync(skill.filepath, targetPath);
        } catch {
          fs.copyFileSync(skill.filepath, targetPath);
        }

        synced++;
      } catch (err) {
        errors.push(`${skill.name}: ${err}`);
      }
    }

    if (errors.length === 0) {
      vscode.window.showInformationMessage(
        `✅ Synced ${synced} skills to Copilot. Use /${
          syncableSkills[0]?.name.replace('file-', '')
        } in chat!`,
      );
    } else {
      vscode.window.showWarningMessage(
        `Synced ${synced} skills, ${errors.length} failed. Check output for details.`,
      );
    }
  });

  // Command: Remove synced skills from Copilot
  const unsyncFromCopilotCmd = vscode.commands.registerCommand(
    'ai-skills.unsyncFromCopilot',
    async () => {
      const copilotDir = getCopilotPromptsDir();

      if (!fs.existsSync(copilotDir)) {
        vscode.window.showInformationMessage('No Copilot prompts directory found');
        return;
      }

      // Find our synced skills (files that match our naming pattern)
      const files = fs.readdirSync(copilotDir);
      const ourFiles = files.filter(
        (f) =>
          f.endsWith('.prompt.md')
          && (f.includes('anatomy')
            || f.includes('diff')
            || f.includes('commit')
            || f.includes('craft')),
      );

      if (ourFiles.length === 0) {
        vscode.window.showInformationMessage('No synced skills found to remove');
        return;
      }

      const confirm = await vscode.window.showWarningMessage(
        `Remove ${ourFiles.length} synced skill(s) from Copilot?`,
        'Yes, Remove',
        'Cancel',
      );

      if (confirm !== 'Yes, Remove') return;

      let removed = 0;
      for (const file of ourFiles) {
        try {
          fs.unlinkSync(path.join(copilotDir, file));
          removed++;
        } catch {
          /* ignore */
        }
      }

      vscode.window.showInformationMessage(`✅ Removed ${removed} skills from Copilot`);
    },
  );

  // Command: Show sync status
  const syncStatusCmd = vscode.commands.registerCommand('ai-skills.syncStatus', async () => {
    const copilotDir = getCopilotPromptsDir();
    const skills = loadSkills().filter((s) => !s.filename.startsWith('00-'));

    let status = `**Copilot Prompts Directory:**\n\`${copilotDir}\`\n\n`;

    if (!fs.existsSync(copilotDir)) {
      status += '⚠️ Directory does not exist\n';
    } else {
      const files = fs.readdirSync(copilotDir);
      const promptFiles = files.filter((f) => f.endsWith('.prompt.md') || f.endsWith('.md'));
      status += `**Found ${promptFiles.length} prompt file(s)**\n\n`;

      // Check which of our skills are synced
      status += '**Skill Sync Status:**\n';
      for (const skill of skills) {
        const targetName = skill.filename.replace('.skill.md', '.prompt.md');
        const exists = files.includes(targetName);
        status += `${exists ? '✅' : '❌'} ${skill.name}\n`;
      }
    }

    vscode.window.showInformationMessage(status, { modal: true });
  });

  // Command: Open Copilot prompts folder
  const openCopilotFolderCmd = vscode.commands.registerCommand(
    'ai-skills.openCopilotFolder',
    async () => {
      const copilotDir = getCopilotPromptsDir();

      if (!fs.existsSync(copilotDir)) {
        fs.mkdirSync(copilotDir, { recursive: true });
      }

      await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(copilotDir));
    },
  );

  context.subscriptions.push(
    loadCmd,
    loadToCopilotCmd,
    syncToCopilotCmd,
    unsyncFromCopilotCmd,
    syncStatusCmd,
    openCopilotFolderCmd,
  );
}

export function deactivate() {}

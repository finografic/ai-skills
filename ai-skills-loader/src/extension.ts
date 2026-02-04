import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

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
      content
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

  const files = fs.readdirSync(skillsPath)
    .filter(f => f.endsWith('.skill.md'))
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

function buildSkillPayload(skills: Skill[], selected: Skill): string {
  const config = vscode.workspace.getConfiguration('ai-skills');
  const includeControl = config.get<boolean>('alwaysIncludeControl') ?? true;

  let payload = '';

  // Add control skill (compressed into HTML comment - functional but hidden)
  if (includeControl && !selected.filename.startsWith('00-')) {
    const controlSkill = skills.find(s => s.filename.startsWith('00-'));
    if (controlSkill) {
      const controlBody = getSkillBody(controlSkill.content)
        .replace(/\n{2,}/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
      payload += `<!-- ${controlBody} -->\n\n`;
    }
  }

  // Add selected skill - minimal header, body only (no YAML frontmatter)
  const skillBody = getSkillBody(selected.content);
  payload += `⚡ **${selected.name}**\n\n${skillBody}\n\n---\n\n`;

  return payload;
}

async function selectSkill(): Promise<{ payload: string; skill: Skill } | undefined> {
  const skills = loadSkills();
  if (skills.length === 0) {
    vscode.window.showErrorMessage('No skills found');
    return;
  }

  // Filter out control skill from picker (it's auto-included)
  const pickableSkills = skills.filter(s => !s.filename.startsWith('00-'));

  const items = pickableSkills.map(s => ({
    label: s.name,
    description: s.filename,
    detail: s.description,
    skill: s
  }));

  const picked = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a skill to load',
    matchOnDescription: true,
    matchOnDetail: true
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
        isPartialQuery: true  // ← This prevents auto-send!
      });
      vscode.window.showInformationMessage(`⚡ ${result.skill.name} loaded — add context and send`);
    } catch {
      // Fallback to clipboard if the command fails
      await vscode.env.clipboard.writeText(result.payload);
      await vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
      vscode.window.showInformationMessage(
        `⚡ ${result.skill.name} ready — Cmd+V to paste, add context, then send`
      );
    }
  });

  context.subscriptions.push(loadCmd, loadToCopilotCmd);
}

export function deactivate() {}

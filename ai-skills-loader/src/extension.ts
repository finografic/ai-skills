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

function buildSkillPayload(skills: Skill[], selected: Skill): string {
  const config = vscode.workspace.getConfiguration('ai-skills');
  const includeControl = config.get<boolean>('alwaysIncludeControl') ?? true;
  
  let payload = '';
  
  // Add control skill (hidden in comment block so it's not visually noisy)
  if (includeControl && !selected.filename.startsWith('00-')) {
    const controlSkill = skills.find(s => s.filename.startsWith('00-'));
    if (controlSkill) {
      payload += `<!--\n[BASE SKILL: ${controlSkill.name}]\n${controlSkill.content}\n-->\n\n`;
    }
  }
  
  // Add selected skill (visible)
  payload += `**[SKILL: ${selected.name}]**\n\n${selected.content}\n\n---\n\n`;
  
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
  
  // Command: Load skill and open Copilot with pre-filled prompt
  const loadToCopilotCmd = vscode.commands.registerCommand('ai-skills.loadToCopilot', async () => {
    const result = await selectSkill();
    if (!result) return;
    
    // Try direct insertion into Copilot chat
    try {
      await vscode.commands.executeCommand('workbench.action.chat.open', {
        query: result.payload
      });
      vscode.window.showInformationMessage(`✅ Skill "${result.skill.name}" loaded`);
    } catch {
      // Fallback to clipboard if direct insertion fails
      await vscode.env.clipboard.writeText(result.payload);
      await vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
      vscode.window.showInformationMessage(
        `✅ Skill "${result.skill.name}" ready — paste into chat (Cmd+V)`
      );
    }
  });
  
  context.subscriptions.push(loadCmd, loadToCopilotCmd);
}

export function deactivate() {}

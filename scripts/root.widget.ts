import type { TemplateResult } from 'lit-html';
import { html, render } from 'lit-html';
import { exportWidget } from './export.widget';
import { reListWidget } from './re-list.widget';
import { routerService } from './router.service';
const root: HTMLDivElement = document.createElement('div');
root.classList.add('b-kb-root');
document.body.append(root);

const rootTemplate: TemplateResult = html` ${reListWidget} ${exportWidget} `;

routerService.subscribe((path: string) => console.log(path));
render(rootTemplate, root);

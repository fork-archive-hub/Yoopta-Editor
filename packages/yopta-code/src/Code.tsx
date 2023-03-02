import Prism from 'prismjs';
import { Editor, Element, Transforms } from 'slate';
import { createYoptaComponent, getNodeByPath } from '@yopta/editor';
import { CodeLeaf } from './ui/CodeLeaf';
import { CodeRender } from './ui/CodeRender';
import { CodeLineRender } from './ui/CodeLineRender';
import { codeLineDecorator } from './utils/decorator';

const CODE_NODE_TYPE = 'code';
const CODE_LINE_NODE_TYPE = 'code-line';

const Code = createYoptaComponent({
  type: CODE_NODE_TYPE,
  renderer: CodeRender,
  shortcut: '<',
});

const CodeLine = createYoptaComponent({
  type: CODE_LINE_NODE_TYPE,
  renderer: CodeLineRender,
  leaf: () => CodeLeaf,
  decorator: codeLineDecorator,
  handlers: {
    onKeyDown:
      (editor, { hotkeys }) =>
      (event) => {
        if (!editor.selection) return;

        // [TODO] - define this function in options
        const node = getNodeByPath(editor, editor.selection.anchor.path, 'lowest');

        if (node.type !== CODE_LINE_NODE_TYPE) return;

        if (hotkeys.isIndent(event)) {
          console.log(event);

          event.preventDefault();

          const text = ' '.repeat(2);
          Transforms.insertText(editor, text);
          return;
        }

        if (hotkeys.isSelect(event)) {
          event.preventDefault();

          const codeEntry = Editor.above(editor, {
            at: editor.selection.anchor.path,
            match: (n) => Element.isElement(n) && n.type === CODE_NODE_TYPE,
          });

          if (!codeEntry) return;
          Transforms.select(editor, codeEntry[1]);
          return;
        }

        // if (hotkeys.isSoftBreak(event)) {
        //   event.preventDefault();

        //   Transforms.splitNodes(editor, { always: true });
        //   Transforms.setNodes(editor, defaultComponent);
        //   return;
        // }
      },
  },
});

export { Code, CodeLine };
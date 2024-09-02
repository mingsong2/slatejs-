import React, { useState, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createEditor, Editor, Transforms, Element } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}
function App() {
  const [editor] = useState(() => withReact(createEditor()))
  const [count, setCount] = useState(0)
  const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])
  return (
    <div className='editor-wrap'>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable 
          renderElement={renderElement}
          onKeyDown={event => {
            if (event.key === '&') {
              // Prevent the ampersand character from being inserted.
              event.preventDefault()
              // Execute the `insertText` method when the event occurs.
              editor.insertText('and')
            }

            if (event.key === '`' && event.ctrlKey) {
              event.preventDefault()
              // Determine whether any of the currently selected blocks are code blocks.
              const [match] = Editor.nodes(editor, {
                match: n => n.type === 'code',
              })
              // Toggle the block type depending on whether there's already a match.
              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'code' },
                { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
              )
            }
          }}
        />
      </Slate>
    </div>
  )
}

export default App

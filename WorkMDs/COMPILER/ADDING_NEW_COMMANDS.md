# Adding New Commands to Compiler

## Step 1: Choose scope
Add command in one or both places:
- Homepage: `src/components/Homepage/Compiler.js`
- Projects page: `src/components/Projects/Compiler.js`

## Step 2: Add command handler in `commands` object
Example pattern:
```js
const commands = {
  '/newcommand': () => {
    // action here (navigate, toggle state, animation, etc.)
  }
}
```

Important:
- Command key should be lowercase (`'/newcommand'`)
- Input is lowercased in `CommandInputBox`, so lowercase keys are safest

## Step 3: Add command to visible list (optional but recommended)
Add a list button in the compiler menu so users discover the command:
```jsx
<button onClick={commands['/newcommand']} className='listItem'>
  <span>/newcommand</span>
</button>
```

## Step 4: If animation/helper is needed, add in `src/Commands.js`
Keep reusable GSAP or shared behavior in `src/Commands.js`, then import where needed.

## Step 5: Validate
- Type the command manually in input box
- Confirm no shake/error state
- Confirm expected behavior occurs
- Confirm help/list state still works

## Common pitfalls
- Mismatch between displayed command and command key
- Forgetting lowercase command key
- Calling a missing key in `commands['/...']`
- Adding list item without actual handler

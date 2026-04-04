/**
 * 🔒 LOCKED — React · TS lesson 6 — List Rendering with map (TypeScript).
 * Do not change steps, copy, or evaluation without explicit product/content sign-off.
 * Generated mirror: content/generated/react-ts/006_list-rendering-with-map_lesson.json
 */
import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    "id": "intro",
    "type": "reveal",
    "phase": "Lesson",
    "content": {
      "tag": "LESSON #6 (TypeScript)",
      "title": "List Rendering with map() — Typed",
      "body": "In React, you often need to display lists of data. Instead of manually writing repetitive JSX, you can use JavaScript's map() method to transform arrays into React elements. With TypeScript, you'll add type safety to ensure your data structures are well-defined.",
      "usecase": "Displaying lists of users, products, tasks, or any collection where each item shares a similar visual structure."
    }
  },
  {
    "id": "objectives",
    "type": "objectives",
    "phase": "Objectives",
    "items": [
      "Transform an array of typed data into JSX elements using map()",
      "Add a unique key prop to each rendered list item",
      "Handle empty arrays gracefully with conditional rendering",
      "Type event handlers for list interactions"
    ]
  },
  {
    "id": "step1",
    "type": "question",
    "phase": "Step 1 of 7",
    "paal": "Import React and the useState hook from the 'react' package.",
    "hint": "Use a combination of default and named imports in a single statement.",
    "example_code": "import React, { useEffect } from 'react'",
    "think_prompt": "Which import statement gives us both React and the useState hook?",
    "mc_options": [
      "import React from 'react'",
      "import { useState } from 'react'",
      "import React, { useState } from 'react'"
    ],
    "mc_correct_option": "import React, { useState } from 'react'",
    "mc_anchor": "We need both the default React import (for JSX) and the named useState import (for state management).",
    "why_this_matters": "React provides the core library for building components, and useState lets us manage dynamic data that will drive our list rendering.",
    "answer_keywords": [
      "import",
      "React",
      "{ useState }",
      "'react'"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've imported the essential tools for building a stateful React component.",
    "feedback_partial": "You're close! Remember we need both React (for JSX) and useState (for state).",
    "feedback_wrong": "Let's try again. We need to import both React and the useState hook from 'react'.",
    "expected": "The component will have access to React and useState."
  },
  {
    "id": "step2",
    "type": "question",
    "phase": "Step 2 of 7",
    "paal": "Define a type called Item that has id (number) and text (string) properties, then create a functional component called ItemList.",
    "hint": "Start with 'type Item = {...}', then define 'const ItemList = () => {...}'.",
    "example_code": "type User = { id: string; name: string };\nconst UserList = () => { ... }",
    "think_prompt": "Where should we define the type for our list items to make it accessible throughout the component?",
    "mc_options": [
      "Inside the component function",
      "As a global variable",
      "Outside the component, before its definition"
    ],
    "mc_correct_option": "Outside the component, before its definition",
    "mc_anchor": "Type definitions should be placed outside components so they can be reused and don't get recreated on every render.",
    "why_this_matters": "TypeScript requires us to define the shape of our data before using it. This prevents runtime errors and makes our code self-documenting.",
    "answer_keywords": [
      "type Item",
      "id:",
      "text:",
      "const ItemList",
      "=>"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Great! You've created a well-typed foundation for your list component.",
    "feedback_partial": "Almost there! Make sure you define both the Item type and the ItemList component.",
    "feedback_wrong": "Let's review: we need a type definition for our list items, then a component function.",
    "expected": "A typed component skeleton ready for state and JSX."
  },
  {
    "id": "step3",
    "type": "question",
    "phase": "Step 3 of 7",
    "paal": "Declare state to hold an array of Item objects. Initialize it with at least two sample items (each with unique id and text).",
    "hint": "Use useState<Item[]> with an initial array containing objects matching your Item type.",
    "example_code": "const [users] = useState<User[]>([{ id: 1, name: 'Alice' }])",
    "think_prompt": "What's the correct way to type useState for an array of Item objects?",
    "mc_options": [
      "const [items] = useState([])",
      "const [items] = useState<Item[]>([])",
      "const [items] = useState<Array>([])"
    ],
    "mc_correct_option": "const [items] = useState<Item[]>([])",
    "mc_anchor": "TypeScript needs the generic parameter <Item[]> to know what type of array useState should manage.",
    "why_this_matters": "State provides the dynamic data that React will render. By typing our state, TypeScript ensures we only store data matching our Item structure.",
    "answer_keywords": [
      "useState<Item[]>",
      "[{",
      "id:",
      "text:",
      "}]"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! You've created typed state that will drive your list rendering.",
    "feedback_partial": "Good start! Make sure you include the Item[] type parameter and provide initial data.",
    "feedback_wrong": "Let's adjust: useState needs the Item[] type and an initial array of items.",
    "expected": "State variable containing an array of typed items."
  },
  {
    "id": "step4",
    "type": "question",
    "phase": "Step 4 of 7",
    "paal": "Make your component return a div containing an h1 with the text 'My Items' and an empty unordered list (ul).",
    "hint": "Use return ( ... ) with JSX syntax for div, h1, and ul elements.",
    "example_code": "return (\n  <div>\n    <h1>My List</h1>\n    <ul></ul>\n  </div>\n)",
    "think_prompt": "What should a React component return from its function body?",
    "mc_options": [
      "A string of HTML",
      "JSX elements",
      "A plain JavaScript object"
    ],
    "mc_correct_option": "JSX elements",
    "mc_anchor": "React components return JSX, which looks like HTML but gets transformed into React elements.",
    "why_this_matters": "Every React component must return JSX. Starting with a simple structure helps us build incrementally.",
    "answer_keywords": [
      "return",
      "<div>",
      "<h1>",
      "My Items",
      "<ul>"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've set up the visual structure for your list.",
    "feedback_partial": "Almost! Make sure you're returning JSX with both a heading and a list container.",
    "feedback_wrong": "Let's try again: the component needs to return JSX with a heading and list.",
    "expected": "Component renders a heading and empty list container."
  },
  {
    "id": "step5",
    "type": "question",
    "phase": "Step 5 of 7",
    "paal": "Inside the ul, use map() on your items array to render each item as an li element showing its text.",
    "hint": "Use {items.map(item => ...)} inside the ul tags.",
    "example_code": "{users.map(user => <li>{user.name}</li>)}",
    "think_prompt": "How do we convert an array of data into an array of JSX elements?",
    "mc_options": [
      "Using a for loop inside JSX",
      "Using the map() method",
      "Using the filter() method"
    ],
    "mc_correct_option": "Using the map() method",
    "mc_anchor": "map() creates a new array by calling a function on each element, perfect for transforming data to JSX.",
    "why_this_matters": "The map() method transforms data into UI. This is the core pattern for rendering lists in React.",
    "answer_keywords": [
      "items.map",
      "item =>",
      "<li>",
      "{item.text}"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! You're transforming data into UI with map().",
    "feedback_partial": "Good progress! Make sure you're calling map() on items and rendering li elements.",
    "feedback_wrong": "Let's review: we need to map over items and render each one as an li.",
    "expected": "Each item appears as a list item with its text displayed."
  },
  {
    "id": "step6",
    "type": "question",
    "phase": "Step 6 of 7",
    "paal": "Add a key prop to each li element using the item's id property.",
    "hint": "Add key={item.id} to the li element.",
    "example_code": "<li key={user.id}>{user.name}</li>",
    "think_prompt": "Why does React need a key prop when rendering lists?",
    "mc_options": [
      "To apply CSS styles",
      "To identify elements during updates",
      "To make the HTML valid"
    ],
    "mc_correct_option": "To identify elements during updates",
    "mc_anchor": "Keys help React track elements efficiently. Without them, React might re-render the entire list unnecessarily.",
    "why_this_matters": "React uses keys to identify which items have changed, been added, or removed. This is essential for performance and correct rendering.",
    "answer_keywords": [
      "key={item.id}"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Perfect! You've added the essential key prop for React's rendering optimization.",
    "feedback_partial": "Almost! Make sure you're adding the key prop to the li element.",
    "feedback_wrong": "Let's adjust: each li needs a key prop using item.id.",
    "expected": "Each list item has a unique key prop."
  },
  {
    "id": "step7",
    "type": "question",
    "phase": "Step 7 of 7",
    "paal": "If the items array is empty, display a paragraph saying 'No items yet' instead of the list.",
    "hint": "Use a ternary operator: {items.length ? ... : <p>No items yet</p>}",
    "example_code": "{todos.length ? todos.map(...) : <p>No todos</p>}",
    "think_prompt": "How can we conditionally render content based on whether an array is empty?",
    "mc_options": [
      "Using an if statement inside JSX",
      "Using the ternary operator",
      "Using the logical AND operator"
    ],
    "mc_correct_option": "Using the ternary operator",
    "mc_anchor": "Conditional rendering lets us show different UI based on application state, making our components more robust.",
    "why_this_matters": "Real applications often deal with empty data states. Providing a user-friendly message improves the experience.",
    "answer_keywords": [
      "items.length",
      "?",
      ":",
      "<p>",
      "No items yet"
    ],
    "seed_code": "",
    "starter_code": "",
    "feedback_correct": "Excellent! Your component now handles all states gracefully.",
    "feedback_partial": "Good! Make sure you're using a ternary operator to check items.length.",
    "feedback_wrong": "Let's review: we need to check if items is empty and show a message if it is.",
    "expected": "Empty state shows friendly message instead of empty list."
  }
];

const sideItems = [
  {
    "label": "Lesson",
    "id": "intro"
  },
  {
    "label": "Objectives",
    "id": "objectives"
  },
  {
    "label": "Step 1",
    "id": "step1"
  },
  {
    "label": "Step 2",
    "id": "step2"
  },
  {
    "label": "Step 3",
    "id": "step3"
  },
  {
    "label": "Step 4",
    "id": "step4"
  },
  {
    "label": "Step 5",
    "id": "step5"
  },
  {
    "label": "Step 6",
    "id": "step6"
  },
  {
    "label": "Step 7",
    "id": "step7"
  }
];

export default createINPACTEngine({ NODES, sideItems, lessonNum: 6, title: "List Rendering with map() (TypeScript)", shortName: "TS — LIST RENDERING WITH MAP()" });

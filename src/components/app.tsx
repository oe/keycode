import { useState, useCallback } from 'react'

import './style.scss'

export function App() {
  const [keyEvent, setKeyEvent] = useState<React.KeyboardEvent<HTMLInputElement>>()
  const [value, setValue] = useState('')

  const onInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    // set the value to a zero-width space to prevent the input from being empty
    setValue('\u200B')
    console.log('keyboardEvent', event.key, event)
    setKeyEvent(event)
  }, [])


  return (
    <div className='container mx-auto max-w-xl mt-8'>
      <h1 className=" p-4 my-4 text-center ">
        <span className='text-gradient text-6xl font-bold'>Keycode</span>
        <small className='block text-xl mt-2 font-serif italic'>get keyboard event detail </small>
      </h1>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          onKeyDownCapture={onInputKeyDown}
          type="text"
          value={value}
          className="block w-full rounded-md border-0 py-1.5 px-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-900" placeholder="Press any key"
          autoFocus />
        <KeyPressLabel event={keyEvent} />
      </div>
      <KeyPressDetails event={keyEvent} />
    </div>
  )
}

const isApple = navigator.platform.includes('Mac') || /iPad|iPhone|iPod/.test(navigator.userAgent)

const MODIFIER_KEYS = [
  { key: 'metaKey', label: isApple ? '⌘ command' : '⊞ windows'},
  { key: 'ctrlKey', label: '⌃ ctrl' },
  { key: 'shiftKey', label: '⇧ shift' },
  { key: 'altKey', label: '⌥ alt' },
]

const SPECIAL_KEY_MAP: Record<string, string> = {
  'Enter': '⏎ enter',
  'Escape': '⎋ escape',
  'Backspace': '⌫ backspace',
  'Tab': '⇥ tab',
  'ArrowUp': '↑ arrow up',
  'ArrowDown': '↓ arrow down',
  'ArrowLeft': '← arrow left',
  'ArrowRight': '→ arrow right',
  'Delete': '⌦ delete',
  'CapsLock': '⇪ caps lock',
  'PageUp': '⇞ page up',
  'PageDown': '⇟ page down',
  'Home': '↖ home',
  'End': '↘ end',
  'Insert': '⎀ insert',
  ' ': '␣ space',
}

const MODIFIERS = ['Control', 'Shift', 'Alt', 'Meta']

const isModifierKey = (key: string) => MODIFIERS.includes(key)


function KeyPressLabel(props: { event?: React.KeyboardEvent<HTMLInputElement> }) {
  const { event } = props
  if (!event) return null
  // @ts-ignore
  const modifiers = MODIFIER_KEYS.filter(({ key }) => event[key])
  const isModifier = isModifierKey(event.key)
  const usingThirdInput = event.keyCode === 229
  return (
    <div className="absolute top-1 left-5 pointer-events-none text-slate-600">
      {
        modifiers.map(({ key, label }) => (
          <Kbd key={key}>{label}</Kbd>
        ))
      }
      {isModifier || <Kbd>{SPECIAL_KEY_MAP[event.key] || event.key}{usingThirdInput ? ' (using third part IME)' : ''}</Kbd>}
    </div>
  )
}

function KeyPressDetails(props: { event?: React.KeyboardEvent<HTMLInputElement> }) {
  const { event } = props
  if (!event) return null
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Key Press Details</h2>
      <div className='font-normal text-small'>Reveal devtools' console to inspect the event object for more</div>
      <div className="text-xs text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-700 font-mono border  border-gray-200 rounded-lg p-2 mt-2">
        <EventDetail event={event} />
      </div>

      <div className='mt-2'>
        Check <a className='text-sky-300' href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent">MDN KeyboardEvent</a> for specification of keyboard event
      </div>
    </div>
  )
}



function Kbd (props: { children: any }) {
  return <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 rounded-lg mr-2">{props.children}</kbd>
}

function EventDetail(props: {event: React.KeyboardEvent<HTMLInputElement>}) {
  const detail = getKeyPressInfo(props.event)
  return Object.keys(detail).map(key => {
    // @ts-ignore
    const value = detail[key]
    const formatValue = typeof value !== 'string' ? String(value) : JSON.stringify(value)
    return (
      <div key={key} className='flex items-start mb-1 space-x-2'>
        <span className='text-gray-500'>{key}:</span>
        <span className='text-gray-800 dark:text-gray-400'>{formatValue}</span>
        <div className='text-gray-500 whitespace-pre-wrap'>// {keyInfoMap[key] || ''}</div>
      </div>
    )
  })
}

const keyInfoMap: Record<string, any> = {
  key: 'The key value, used in most case',
  code: 'A unique code for the key. More detailed than `key`, e.g. "AltLeft" for "Alt" key, "Digit2" for "2" key',
  keyCode: 'The Unicode reference number of the key, 229 for third-party IME',
  isTrusted: 'Indicate if the event is trusted (generated by user action) or not(simulated by script or other means)',
  repeat: 'Indicate if the key is being held down', 
  location: <><a href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location" className='text-sky-300'>The location</a> of the key on the keyboard</>,
  metaKey: 'Indicate if the meta key is pressed, e.g. ⌘ command on Mac, ⊞ windows on Windows',
  ctrlKey: 'Indicate if the control key is pressed',
  shiftKey: 'Indicate if the shift key is pressed',
  altKey: 'Indicate if the alt key is pressed',
}


function getKeyPressInfo(e: React.KeyboardEvent<HTMLInputElement>) {
  const { isTrusted, key, code, keyCode, ctrlKey, metaKey, shiftKey, repeat, location, altKey } = e
  return {
    key, code, keyCode, isTrusted,
    altKey, ctrlKey, metaKey, shiftKey, repeat, location }
}
import React from 'react'
import { createRoot } from 'react-dom/client'

import Editor from '../src/tabs/editor'

localStorage.setItem(
  'imageSrc',
  'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
)

localStorage.setItem(
  'textItems',
  JSON.stringify([
    {
      id: '730b74c9-f83a-49a9-8bbd-d5f64340869f',
      text: 'sdsaddsaf',
      position: 'top',
      fontFamily: 'SmileySans',
      fontColor: '#000000',
      fontSize: 135,
      x: 649.7375183105469,
      y: 8,
    },
    {
      id: 'd6424f8e-7d4f-413e-8314-73bb7fec28eb',
      text: 'asdfasd',
      position: 'middle',
      fontFamily: 'SmileySans',
      fontColor: '#000000',
      fontSize: 135,
      x: 724.8731384277344,
      y: 472.5,
    },
    {
      id: '2f8baf85-7cbe-4a47-9208-5e1410bc5370',
      text: 'aaa',
      position: 'bottom',
      fontFamily: 'SmileySans',
      fontColor: '#000000',
      fontSize: 135,
      x: 853.9925155639648,
      y: 937,
    },
  ])
)

const root = createRoot(document.getElementById('root')!)
root.render(<Editor />)

import React, { useState } from 'react'
import './App.css'
import axios from 'axios'

const App = () => {

  const [language, setLanguage] = useState('')
  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")

  const handleSumbit = async() => {
    const payload = {
      language,
      code
    }
    console.log(payload)
  try {
    const {data} = await axios.post("http://localhost:4060/run", payload)
    console.log("data", data)
    setOutput(data.output);
    console.log(data.output)

  } catch (error) {
    console.log(error.response)
  }
}

  return (
    <>
    <div id ='App'> 

      <div>
        <h1><i>ONLINE CODE COMPILER</i></h1>

        <div>

        <label>Language : </label>
        <select value={language} onChange={(e)=>{
          setLanguage(e.target.value)
          console.log(e.target.value)
        }}>
          <option>Select</option>
          <option value='c'>C</option>
          <option value='js'>JavaScript</option>
        </select>

        </div>
        <br></br>
        <textarea rows='35' cols="85" value={code} 
        onChange={
          (e)=>{setCode(e.target.value)}
          }></textarea>
      </div>

        <button onClick={handleSumbit}>Run</button>

        <div id='output-box'>
        {/* <textarea rows='25' cols="85"><p>{output}</p></textarea> */}
        <p>{output}</p>
        </div>

    </div>
    </>

  )
}

export default App
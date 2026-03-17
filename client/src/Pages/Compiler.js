import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../App.css'
import axios from 'axios'

const Compiler = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const [problem, setProblem] = useState(null)
    const [language, setLanguage] = useState('')
    const [code, setCode] = useState("")
    const [output, setOutput] = useState("")


    useEffect(() => {
        axios.get(`http://localhost:4060/problems/${id}`)
            .then(res => setProblem(res.data))
            .catch(error => console.log(error))
    }, [id])

    const handleSumbit = async () => {
        if (!language) {
            alert("Please select a language")
            return;
        }
        const payload = {
            language,
            code
        }
        console.log(payload)
        try {
            const { data } = await axios.post("http://localhost:4060/run", payload)
            console.log("data", data)
            setOutput(data.output);
            console.log(data.output)

        } catch ({ response }) {
            if (response) {
                console.log("response : ", response);
            }
            else {
                window.alert("Error connecting to server");
            }
        }
    }

    const handleCommit = async () => {
        if (!language) {
            alert("Please select a language")
            return;
        }
        if (!code) {
            alert("Please write some code")
            return;
        }
        try {
            const { data } = await axios.post("http://localhost:4060/github/commit",
                { code, language, problemId: id },
                { withCredentials: true }
            )
            alert(data.message);
            navigate('/dashboard')
        } catch (error) {
            alert(error.response.data.error)
        }

    }

    return (
        <>
            <div id='App'>

                <div>
                    <h1><i>ONLINE CODE COMPILER</i></h1>

                    {problem && (
                        <div style={{
                            background: '#1e293b',
                            padding: '15px 20px',
                            borderRadius: '10px',
                            marginBottom: '20px'
                        }}>
                            <h5 style={{ color: '#38bdf8' }}>{problem.title}</h5>
                            <p style={{ color: '#e5e7eb' }}>{problem.description}</p>
                        </div>
                    )}

                    <div>

                        <label>Language : </label>
                        <select value={language} onChange={(e) => {
                            setLanguage(e.target.value)
                            console.log(e.target.value)
                        }}>
                            <option value="">Select</option>
                            <option value='c'>C</option>
                            <option value='js'>JavaScript</option>
                            <option value='py'>Python</option>
                        </select>

                    </div>
                    <br></br>
                    <textarea rows='35' cols="110" value={code} placeholder="Start writing your code here...."
                        onChange={
                            (e) => { setCode(e.target.value) }
                        }></textarea>
                </div>

                <button onClick={handleSumbit}>Run</button>
                <button onClick={handleCommit}>Commit</button>

                <div id='output-box'>
                    <textarea rows='25' cols="110" value={output} placeholder="output will be displayed here..!"></textarea>
                    {/* <p>{output}</p> */}
                </div>

            </div>
        </>

    )
}

export default Compiler
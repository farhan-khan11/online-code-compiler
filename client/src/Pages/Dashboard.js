import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
    const { user, problems } = useContext(DataContext)
    const navigate = useNavigate()
    

    const handleLogout = () => {
        axios.get('http://localhost:4060/auth/logout', {
            withCredentials: true
        })
            .then(() => navigate('/'))
    }

    const handleCreateRepo = () => {
        axios.post('http://localhost:4060/github/create-repo', {},{
            withCredentials: true
        })
            .then(res => alert(res.data.message))
            .catch(error => alert(error.response.data.message));
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
            padding: '30px'
        }}>

            {/* Navbar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-white fw-bold">100 Days of Coding</h4>
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={user.avatar}
                        width="35"
                        style={{ borderRadius: '50%' }}
                        alt="avatar"
                    />
                    <span className="text-white">{user.username}</span>
                    {!user.repoCreated && (
                        <button
                            className="btn btn-sm btn-success"
                            onClick={handleCreateRepo}
                        >
                            Create Repo
                        </button>
                    )}
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Problems List */}
            <div className="container">
                <h5 className="text-white mb-3">Problems</h5>
                <div className="row gap-3">
                    {problems.map((problem, index) => (
                        <div key={problem._id} className="col-12">
                            <div
                                style={{ background: '#1e293b', borderRadius: '10px', padding: '15px 20px' }}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <span className="text-secondary me-3">#{index + 1}</span>
                                    <span className="text-white fw-semibold">{problem.title}</span><br></br>
                                    <span className="text-white fw-semibold">{problem.description}</span>
                                </div>
                                <button
                                    className="btn btn-sm"
                                    style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: 'white' }}
                                    onClick={() => navigate(`/compiler/${problem._id}`)}
                                >
                                    Solve
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
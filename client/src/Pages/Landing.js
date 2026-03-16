import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../Context/AuthContext';

const Landing = () => {

    const { user, loading } = useContext(DataContext);
    const navigate = useNavigate();

    // if already logged in then redirecting to dash
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard');
        }
    }, [user, loading]);

    const handleLogin = () => {
        window.location.href = 'http://localhost:4060/auth/github';
    }

    if (loading) return <div className="text-center mt-5 text-white">Loading...</div>

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'white'
        }}>
            <h1 className="mb-2 fw-bold">100 Days of Coding Challenge</h1>
            <p className="mb-4 text-secondary">Build consistency. One problem at a time.</p>
            <button
                onClick={handleLogin}
                className="btn btn-light btn-lg d-flex align-items-center gap-2"
            >
                <img
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                    width="28" alt="github"
                />
                Login with GitHub
            </button>
        </div>
    )
}

export default Landing;
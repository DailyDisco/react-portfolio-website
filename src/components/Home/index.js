import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LogoTitle from '../../assets/images/logo-s.png'
import AnimatedLetters from '../AnimatedLetters'
import Logo from './Logo'
import './index.scss'
import Loader from 'react-loaders'




// There’s a special syntax JSDoc to document a function: usage, parameters, returned value.



const Home = () => {
    const [letterClass, setLetterClass] = useState('text-animate')
    const nameArray = ['o', 'f', 't', 'w', 'a', 'r', 'e', ' ', 'D', 'e', 'v', 'e', 'l', 'o', 'p', 'e', 'r']
    const jobArray = ['D', 'i', 'e', 'g', 'o']
    
    // what does this function do?
    // this is a hook that is used to update classes after 4 seconds have passed.
    useEffect(() => {
        setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 4000)
    }, [])

    return (
        <>
        <div className="container home-page">
            <div className="text-zone">
                
                {/* THIS ONE IS A VALID COMMENT */}

                <h1>


                <span className={letterClass}>H</span>
                <span className={`${letterClass} _12`}>i,</span> { /*what is this syntax saying */}
                <br />
                <span className={`${letterClass} _13`}>I</span>
                <span className={`${letterClass} _14`}>'m</span>
                
                
                
                <img src={LogoTitle} alt="Software Engineer focused on Web Dev, Diego Espino" />
                <AnimatedLetters letterClass={letterClass}
                strArray={nameArray}
                idx={15} 
                />
                <br />


                <AnimatedLetters 
                    letterClass={letterClass}
                    strArray={jobArray}
                    idx={22} 
                />
                </h1>
                <h2>Software Engineer / Focused on AI and Web Development / Learning Machine Learning</h2>
                <Link to="/contact" className="flat-button">
                    CONTACT ME
                </Link>
            </div>
            <Logo />
        </div>
        <Loader type="pacman" />
        </>
    )
}



export default Home

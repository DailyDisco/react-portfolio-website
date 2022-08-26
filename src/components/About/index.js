import { faCss3, faGitAlt, faHtml5, faJsSquare, faPython, faReact } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'


const About = () => {




    // this is a useState "hook". This "hook" sets the initial value for our classes.
    const [letterClass, setLetterClass] = useState('text-animate')



    // this is a hook used for changing classes after 4 seconds have passed.
    useEffect(() => {
        setTimeout(() => {
            setLetterClass('text-animate-hover')
        }, 3000)
    }, [])



    return (
        <>
        <div className='container about-page'>
            <div className='text-zone'>
                <h1>
                    <AnimatedLetters
                        letterClass={letterClass}
                        strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
                        idx={15}
                    />
                </h1>
                <p>
                Hello my name is <em className='keywords'>Diego</em>. I studied Computer Science in school and love researching AI. You can see my work on my portfolio page.
                </p>
                <p>
                I am <em className='keywords'>looking to work remotely</em> as a member of a team to help create features for web and mobile apps. I am familiar with multiple coding languages such as <em className='keywords'>GitHub, Git, JavaScript, React, Node.js, Python, Next.js, TailwindCSS, Rapid API, and HTML.</em> 
                </p>
                </div>

                <div className='stage-cube-cont'>
                    <div className='cubespinner'>

                        <div className='face1'>
                            <FontAwesomeIcon icon={faPython} color="#4b8bbe" />
                        </div>
                        <div className='face2'>
                            <FontAwesomeIcon icon={faHtml5} color="#F06529" />
                        </div>
                        <div className='face3'>
                            <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
                        </div>
                        <div className='face4'>
                            <FontAwesomeIcon icon={faReact} color="#5ED4F4" />
                        </div>
                        <div className='face5'>
                            <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
                        </div>
                        <div className='face6'>
                            <FontAwesomeIcon icon={faGitAlt} color="#EC4D28" />
                        </div>

                    </div>
                </div>
        </div>

        {/* this Loader tag is used to import Loaders */}
        <div className='Loader'>
        <Loader type="pacman" />
        </div>
        </>
    )
}



export default About

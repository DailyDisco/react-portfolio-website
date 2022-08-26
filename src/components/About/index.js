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
                Hello my name is <em className='keywords'>Diego.</em>. I speak <em className='keywords'>English and Spanish.</em> I <em className='keywords'>studied Computer Science</em> while in school.
                </p>
                <p>
                I am <em className='keywords'>looking to work remotely</em> as a member of a team to help create features for web and mobile apps. I am familiar with multiple coding languages such as <em className='keywords'>GitHub, Git, JavaScript, React, Node.js, Python, CSS, and HTML.</em> 
                </p>
                <p>
                    I currently am working on my Machine Learning skills with Python so that I can work in ML or with NLP.
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
        <Loader type="pacman" />
        </>
    )
}



export default About

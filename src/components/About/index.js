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
                Hello my name is <em className='keywords'>Diego!</em>, I speak <em className='keywords'>English and Spanish.</em> I <em className='keywords'>studied Computer Science</em> while in school, and I am currently working on projects such as portfolio sites and a national Pokédex to showcase my full stack web development and CS skills. 
                </p>
                <p>
                I am <em className='keywords'>looking to work remotely</em> as a member of a team to either help create features for web and mobile apps, or design them from the ground up. I am familiar with multiple coding languages such as <em className='keywords'>JavaScript, C++, SQL, MongoDB, Express, React, Node Python, CSS, and HTML.</em> 
                </p>
                <p>
                    I am also learning more <em className='keywords'>Swift</em> so I can program iOS programs. I would <em className='keywords'>like to work with augmented reality or virtual digital assistants,</em> such as Siri. Eventually, I would love to work with <em className='keywords'>Artifical Intellgence</em>, either in <em className='keywords'>machine learning</em> or <em className='keywords'>natural language processing</em>.
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
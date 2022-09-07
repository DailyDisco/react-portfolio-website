// import Head from 'next/head';
import { useState, useEffect } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import Router from 'next/router';
import styles from '../../styles/blog.module.css';
import { Banner } from '../../components';
import './index.scss'

const Blog = ({ posts }) => {
  const router = Router;
  const [mappedPosts, setMappedPosts] = useState([]);

  useEffect(() => {
    if (posts.length) {
      const imgBuilder = imageUrlBuilder({
        projectId: 'p1ozl58j',
        dataset: 'production',
      });
      setMappedPosts(
        posts.map((p) => ({
          ...p,
          mainImage: imgBuilder.image(p.mainImage).width(500).height(250),
        })),
      );
    } else {
      setMappedPosts([]);
    }
  }, [posts]);

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
        // this next line allows us to make our banner customizable on the whole app
          name="Welcome to my personal blog where I talk about health, tech, and pop culture."
          childStyles="md:text-4xl sm:text-2xl xs=text-xl text-left"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />
        <div>
          <div className={styles.main}>

            <h2 className="flex justify-center">Recent Posts</h2>
            <br />
            <div className={styles.feed}>
              {mappedPosts.length ? mappedPosts.map((p, index) => (
                <div onClick={() => router.push(`blog/post/${p.slug.current}`)} key={index} className={styles.post}>
                  <h3>{p.title}</h3>
                  <br />
                  <img className={styles.mainImage} src={p.mainImage} alt="mainImage"/>
                </div>
              )) : <>No Posts Yet</>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
export const getServerSideProps = async (pageContext) => {
  const query = encodeURIComponent('*[_type == "post"]');
  const url = `https://p1ozl58j.api.sanity.io/v1/data/query/production?query=${query}`;

  const result = await fetch(url).then((res) => res.json());

  if (!result.result || !result.result.length) {
    return {
      props: {
        posts: [],
      },
    };
  }
  return {
    props: {
      posts: result.result,
    },
  };
};

export default Blog;
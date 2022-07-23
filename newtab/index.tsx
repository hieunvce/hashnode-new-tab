import { useEffect, useState } from "react"

import "./newtab.css"

const RANDOM_PHOTO_FROM_UNSPLASH = "https://source.unsplash.com/random"
interface Post {
  content: string
  coverImage: string
  dateUpdated: string
  slug: string
  title: string
}

const gql = async (query) => {
  const response = await fetch("https://api.hashnode.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  })
  return response.json()
}

const getPosts = async (username: string) => {
  return gql(
    `{user(username: "${username}"){numPosts,publication{posts{slug}}}}`
  )
}

const getPostContent = async (hostname: string, slug: string) => {
  return gql(
    `{post(slug:"${slug}",hostname:"${hostname}"){slug,title,dateUpdated,content,coverImage}}`
  )
}

function IndexNewtab() {
  const [slug, setSlug] = useState(
    "code-refactoring-tong-quan-ve-code-xau-va-dep"
  )
  const [hostname, setHostname] = useState("simplewriter.hashnode.dev")
  const [post, setPost] = useState<Post | undefined>(undefined)
  const [isLoadingPostError, setIsLoadingPostError] = useState(false)

  useEffect(() => {
    getPosts("hieunguyen")
      .then((data) => {
        const numPosts = data?.data?.user?.numPosts || 0
        const posts = data?.data?.user?.publication?.posts || []
        const randomPostIndex = Math.floor(Math.random() * posts.length)
        const randomPostSlug = posts[randomPostIndex]?.slug || ""
        getPostContent("simplewriter.hashnode.dev", randomPostSlug).then(
          (postData) => {
            const postContent = postData?.data?.post
            setPost(postContent)
          }
        )
      })
      .catch((error) => {
        setIsLoadingPostError(true)
      })
  }, [])

  const featuredImageSrc = post?.coverImage || RANDOM_PHOTO_FROM_UNSPLASH
  return (
    <div className="app-container">
      {isLoadingPostError ? (
        <div className="loading-post-error">
          Something went wrong when loading post. Please try again later.
        </div>
      ) : null}
      <div className="featured-image">
        <img src={featuredImageSrc} alt="featured image" />
      </div>
      <div className="post-header">
        <h1 className="post-title">{post?.title || ""}</h1>
      </div>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post?.content || "" }}
      />

      <div className="post-footer">
        Be present. Do small things with greate love ❤.
      </div>

      <footer>
        <div>
          Made with ❤ in Vietnam. Powered by{" "}
          <a href="https://github.com/PlasmoHQ/plasmo">Plasmo</a>
        </div>
        <div>
          <a href="#">Source code</a>
        </div>
      </footer>
    </div>
  )
}

export default IndexNewtab

import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage"

import "./newtab.css"

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
  const [username, setUsername] = useStorage<string>("username", "simplewriter")
  const [hostname, setHostname] = useStorage<string>(
    "hostname",
    "simplewriterr.hashnode.dev"
  )
  const [post, setPost] = useState<Post | undefined>(undefined)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (username && hostname && username.length > 0 && hostname.length > 0) {
      setErrors([])
      getPosts(username)
        .then((data) => {
          const numPosts = data?.data?.user?.numPosts || 0
          const posts = data?.data?.user?.publication?.posts || []
          const randomPostIndex = Math.floor(Math.random() * posts.length)
          const randomPostSlug = posts[randomPostIndex]?.slug || ""
          getPostContent(hostname, randomPostSlug).then((postData) => {
            const postContent = postData?.data?.post
            setPost(postContent)
          })
        })
        .catch((error) => {
          setErrors(["Error when loading content from Hashnode."])
        })
    } else {
      setErrors([
        "Please config Hashnode username and hostname for using this extension."
      ])
    }
  }, [username, hostname])

  const featuredImageSrc = post?.coverImage || undefined

  return (
    <div className="app-container">
      {featuredImageSrc ? (
        <div className="featured-image">
          <img src={featuredImageSrc} alt="featured image" />
        </div>
      ) : null}

      <div className="post-header">
        <h1 className="post-title">{post?.title || ""}</h1>
      </div>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post?.content || "" }}
      />

      {errors.map((error) => (
        <div className="error" key={error.slice(0, 5).replace(" ", "_")}>
          {error}
        </div>
      ))}

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

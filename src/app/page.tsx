"use client"

import React, { useState } from "react"

export default function HomePage(){
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createShortUrl(e: React.FormEvent){
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult("");

    const response = await fetch("/api/urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", },
        body: JSON.stringify({
          originalUrl: url,
          customCode: customCode || undefined,
      }),
 })

  const data = await response.json();

  setLoading(false);

  if(!response.ok){
    setError(data.error);
    return;
  }

  setResult(data.shortUrl)
  }

  return (
    <>
    <div>
      <h1>
        URL Shortner
      </h1>

      <form onSubmit={createShortUrl}>
        <input
         placeholder="Enter Original URL"
         value={url}
         onChange={(e)=> setUrl(e.target.value)}></input>
         <input
           placeholder="custom code"
           value={customCode}
           onChange={(e)=>
           setCustomCode(e.target.value)}/>

           <button
            disabled={loading}
            >{loading ? "Creating" : "Create Short URL"}</button>

      </form>

{error && (
  <p className="text-red-500">{error}</p>
)}

      {result &&(
        <div>
          <p>
            Your Short URL :
          </p>
          <a href={result} target="_blank" rel="noopener noreferrer">{result}</a>
        </div>
      )}
    </div>
    </>
  )
}
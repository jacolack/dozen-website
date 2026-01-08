const startFresh = () => {
  const state = crypto.randomUUID()
  const nonce = crypto.randomUUID()
  console.log(state)
  localStorage.setItem("state", state)

  AppleID.auth.init({
    clientId: "com.jacksheridan.dozen.signinwithapple",
    redirectURI: "https://api.dozen.social/link/apple",
    state,
    nonce,
    usePopup: false,
  })

  document.getElementById("apple-container").style.display = "block"
  document.getElementById("discord-container").style.display = "none"
  document.getElementById("success-container").style.display = "none"

  return
}

const startDiscord = () => {
  console.log("discord time")

  document.getElementById(
    "login"
  ).href = `https://discord.com/oauth2/authorize?client_id=1458270889656320120&response_type=code&redirect_uri=https%3A%2F%2Fapi.dozen.social%2Flink%2Fdiscord&scope=identify&state=${state}`

  document.getElementById("apple-container").style.display = "none"
  document.getElementById("discord-container").style.display = "block"
  document.getElementById("success-container").style.display = "none"

  return
}

const showSuccess = () => {
  document.getElementById("apple-container").style.display = "none"
  document.getElementById("discord-container").style.display = "none"
  document.getElementById("success-container").style.display = "block"

  return
}

const onLoad = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const stage = urlParams.get("stage")
  const stateHash = urlParams.get("stateHash")

  const state = localStorage.getItem("state")

  const encoder = new TextEncoder()
  const data = encoder.encode(state)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
  const hashedState = new Uint8Array(hashBuffer).toHex()

  if (!stage || !stateHash || !state || stateHash !== hashedState) {
    console.log("start fresh")
    startFresh()
    return
  }

  if (stage == "discord") {
    console.log("start discord")
    startDiscord()
    return
  }

  if (stage == "success") {
    console.log("show success")
    showSuccess()
    return
  }

  startFresh()
  return
}

onLoad()

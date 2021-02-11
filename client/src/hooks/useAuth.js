import {useState, useCallback, useEffect} from 'react'

const storageName = 'warofthenumenor'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
 

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken)
    setUserId(id)

    window.localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }))
  }, [])


  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    window.localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, userId: userId, ready }
}
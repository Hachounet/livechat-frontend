import { useState, useEffect } from 'react';
import { useChatContext } from '../ChatContext';

export default function useAuth(url, method = 'GET', body = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setLogged, token } = useChatContext();

  useEffect(() => {
    if (!token) {
      setLogged(false);
      window.location.href = '/login';
      return;
    }

    // Initialiser les options de fetch
    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // Ajouter le corps de la requête si présent
    if (body) {
      options.body = JSON.stringify(body);
    }

    fetch(url, options)
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          setLogged(false);
          window.location.href = '/login';
          return;
        }

        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [setLogged, token, url, method, body]);

  return { data, loading, error };
}

import { useState, useEffect } from 'react';
import { useChatContext } from '../ChatContext';
import { useNavigate } from 'react-router-dom';

export default function useAuth(url, method = 'GET', body = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setLogged, token } = useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLogged(false);
      navigate('/');
      return;
    }

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    fetch(url, options)
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          setLogged(false);
          navigate('/');
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

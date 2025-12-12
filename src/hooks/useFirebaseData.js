import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';

export const useFirebaseNodes = () => {
  const [nodes, setNodes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const nodesRef = ref(db, 'devices');
    
    const handleValue = (snapshot) => {
      setLoading(false);
      const data = snapshot.val();
      if (data) {
        setNodes(data);
      } else {
        setNodes({});
      }
    };

    const handleError = (err) => {
        setLoading(false);
        setError(err.message);
        console.error("Firebase Nodes Error:", err);
    };

    const unsubscribe = onValue(nodesRef, handleValue, handleError);

    return () => unsubscribe();
  }, []);

  return { nodes, loading, error };
};

export const useFirebaseLogs = () => {
    const [logs, setLogs] = useState({ critical: {}, rescue: {}, receiver: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Listen to the root 'logs' path, but also checking 'receiver_logs' might be needed
        // based on user input. For now, let's look at the implementation. 
        // If the user says data is there but not showing, maybe we should listen to root to see structure?
        // No, let's stick to specific paths but expand.
        
        const logsRef = ref(db, '/'); // Let's listen to root momentarily to debug structure or grab sibling paths

        const handleValue = (snapshot) => {
            setLoading(false);
            const data = snapshot.val();
            if (data) {
                // Check where the logs actually are
                const critical = data.logs?.critical || {};
                const rescue = data.logs?.rescue || {};
                // The user showed data that might be in 'receiver_logs' or root level alerts
                const receiver = data.receiver_logs || {};
                
                // Debug log to console to help dev see what's coming
                console.log("Firebase Data Snapshot:", data);

                setLogs({
                    critical,
                    rescue,
                    receiver
                });
            } else {
                setLogs({ critical: {}, rescue: {}, receiver: {} });
            }
        };

        const handleError = (err) => {
            setLoading(false);
            setError(err.message);
            console.error("Firebase Logs Error:", err);
        };

        const unsubscribe = onValue(logsRef, handleValue, handleError);

        return () => unsubscribe();
    }, []);

    return { logs, loading, error };
};

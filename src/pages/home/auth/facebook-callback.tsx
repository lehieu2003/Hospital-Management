import { useFacebookResponse } from '@/services/api';
import useUserStore from '@/stores/user-store';
import dayjs from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleCallback() {
    const navigate = useNavigate();
    const { setProfile, setToken, setIsFetching } = useUserStore();
    const { data } = useFacebookResponse({
        query: {
            retry: false,
            retryOnMount: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            select: (data) => data.data,
        },
    });

    React.useEffect(() => {
        if (data) {
            console.log({
                accessToken: data.token?.token!,
                expirationAt: dayjs(data.token?.expires).toDate(),
            });
            setToken({
                accessToken: data.token?.token!,
                expirationAt: dayjs(data.token?.expires).toDate(),
            });
            setProfile(data.user!);
            setIsFetching(false);
            navigate('/');
        }
    }, [data]);
    return <div>Loading</div>;
}

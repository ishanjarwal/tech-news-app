import { selectUserState, userProfile } from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, initialized, user } = useSelector(selectUserState);

  useEffect(() => {
    if (!initialized) {
      dispatch(userProfile());
    }
  }, [dispatch, initialized]);

  return {
    loading,
    initialized,
    user,
  };
};

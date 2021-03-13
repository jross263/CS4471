import React from 'react';
import { useSelector } from 'react-redux';


function HomePage() {
    const user = useSelector(state => state.authentication.user);

    return (
        <div className="col-lg-8 offset-lg-2">
            <h1>Hi {user.firstName}!</h1>
        </div>
    );
}

export { HomePage };
import React from 'react';

const UserCard = ({ user, actionLabel, onAction }) => (
  <div className="card">
    <h3>{user.name}</h3>
    <p>From: {user.From}</p>
    <p>To: {user.To}</p>
    <button onClick={() => onAction(user.id)}>{actionLabel}</button>
  </div>
);

export default UserCard;

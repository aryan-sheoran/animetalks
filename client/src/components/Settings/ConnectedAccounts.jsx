import React, { useState } from 'react';
import styles from '../../pages/setting/setting.module.css';

const ConnectedAccounts = ({ user, onToast }) => {
  const [connectedAccounts, setConnectedAccounts] = useState({
    google: { connected: true, email: 'sarah.johnson@gmail.com' },
    twitter: { connected: true, username: '@sarahjohnson' },
    facebook: { connected: false },
    discord: { connected: false },
    mal: { connected: true, username: 'sarahj_2023' },
    crunchyroll: { connected: false }
  });

  const [loadingStates, setLoadingStates] = useState({});

  const socialAccounts = [
    { id: 'google', icon: 'fab fa-google', label: 'Google', displayKey: 'email' },
    { id: 'twitter', icon: 'fab fa-twitter', label: 'Twitter', displayKey: 'username' },
    { id: 'facebook', icon: 'fab fa-facebook', label: 'Facebook' },
    { id: 'discord', icon: 'fab fa-discord', label: 'Discord' }
  ];

  const animeAccounts = [
    { id: 'mal', icon: 'fas fa-film', label: 'MyAnimeList', displayKey: 'username' },
    { id: 'crunchyroll', icon: 'fas fa-tv', label: 'Crunchyroll' }
  ];

  const handleAccountAction = async (accountId, action) => {
    setLoadingStates(prev => ({ ...prev, [accountId]: true }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setConnectedAccounts(prev => {
        const updated = { ...prev };
        if (action === 'connect') {
          updated[accountId] = { 
            connected: true, 
            username: `user_${Date.now()}`,
            email: `user@${accountId}.com`
          };
          onToast(`Connected to ${accountId} successfully!`);
        } else {
          updated[accountId] = { connected: false };
          onToast(`Disconnected from ${accountId} successfully!`);
        }
        return updated;
      });
    } catch (error) {
      onToast(`Failed to ${action} ${accountId}. Please try again.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [accountId]: false }));
    }
  };

  const renderAccountCard = (account) => {
    const accountData = connectedAccounts[account.id];
    const isLoading = loadingStates[account.id];
    const isConnected = accountData?.connected;

    return (
      <div 
        key={account.id} 
        className={`${styles.connectedAccount} ${!isConnected ? styles.notConnected : ''}`}
      >
        <div className={styles.accountInfo}>
          <i className={account.icon}></i>
          <div>
            <h4>{account.label}</h4>
            <p>
              {isConnected 
                ? accountData[account.displayKey] || 'Connected'
                : 'Not connected'
              }
            </p>
          </div>
        </div>
        <button
          className={isConnected ? styles.btnSubtle : styles.btnConnect}
          onClick={() => handleAccountAction(account.id, isConnected ? 'disconnect' : 'connect')}
          disabled={isLoading}
        >
          {isLoading 
            ? (isConnected ? 'Disconnecting...' : 'Connecting...')
            : (isConnected ? 'Disconnect' : 'Connect')
          }
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={styles.panelHeader}>
        <h2>Connected Accounts</h2>
        <p>Link your other accounts for easy sign-in and sharing</p>
      </div>

      <div className={styles.settingsCard}>
        <h3>Social Accounts</h3>
        <div className={styles.connectedAccounts}>
          {socialAccounts.map(renderAccountCard)}
        </div>
      </div>

      <div className={styles.settingsCard}>
        <h3>Anime Platforms</h3>
        <div className={styles.connectedAccounts}>
          {animeAccounts.map(renderAccountCard)}
        </div>
      </div>
    </>
  );
};

export default ConnectedAccounts;
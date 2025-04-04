// hooks/useSiteSettings.js
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // Make sure to install this package

export default function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings');
        const result = await response.json();
        
        if (result.success) {
          setSiteSettings(result.data);
        } else {
          setError(result.message || 'Failed to fetch settings');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Function to update a single field
  const handleInputChange = (section, field, value) => {
    setSiteSettings({
      ...siteSettings,
      [section]: {
        ...siteSettings[section],
        [field]: value
      }
    });
    setHasUnsavedChanges(true);
  };

  // Function to toggle checkbox fields
  const handleCheckboxChange = (section, field) => {
    setSiteSettings({
      ...siteSettings,
      [section]: {
        ...siteSettings[section],
        [field]: !siteSettings[section][field]
      }
    });
    setHasUnsavedChanges(true);
  };

  // Handle adding a new item to an array in the state
  const handleAddItem = (section, field, defaultItem) => {
    setSiteSettings({
      ...siteSettings,
      [section]: {
        ...siteSettings[section],
        [field]: [...(siteSettings[section][field] || []), defaultItem]
      }
    });
    setHasUnsavedChanges(true);
  };

  // Handle removing an item from an array in the state
  const handleRemoveItem = (section, field, index) => {
    const updatedItems = [...siteSettings[section][field]];
    updatedItems.splice(index, 1);
    
    setSiteSettings({
      ...siteSettings,
      [section]: {
        ...siteSettings[section],
        [field]: updatedItems
      }
    });
    setHasUnsavedChanges(true);
  };

  // Handle changing a value of an item in an array
  const handleItemChange = (section, field, index, itemKey, value) => {
    const updatedItems = [...siteSettings[section][field]];
    updatedItems[index] = {
      ...updatedItems[index],
      [itemKey]: value
    };
    
    setSiteSettings({
      ...siteSettings,
      [section]: {
        ...siteSettings[section],
        [field]: updatedItems
      }
    });
    setHasUnsavedChanges(true);
  };

  // Save settings to the server
  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteSettings),
      });

      const result = await response.json();
      
      if (result.success) {
        setHasUnsavedChanges(false);
        toast.success('Settings saved successfully!');
        return true;
      } else {
        toast.error(result.message || 'Failed to save settings');
        return false;
      }
    } catch (err) {
      toast.error('Error connecting to the server');
      console.error(err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    siteSettings,
    loading,
    error,
    hasUnsavedChanges,
    saving,
    handleInputChange,
    handleCheckboxChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    saveSettings
  };
}
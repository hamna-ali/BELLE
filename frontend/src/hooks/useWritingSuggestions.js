import { useState, useCallback } from "react";
import { getWritingSuggestion } from "../api/blog";

export const useWritingSuggestions = () => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSuggestion = useCallback(async (text, context = "content") => {
    if (!text || text.length < 10) return;
    
    setLoading(true);
    try {
      const response = await getWritingSuggestion(text, context);
      if (response.success && response.suggestion) {
        setSuggestion({
          text: response.suggestion,
          original: text,
          context: context
        });
      }
    } catch (error) {
      console.error("Suggestion error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  const acceptSuggestion = useCallback((inputElement) => {
    if (!suggestion || !inputElement) return;
    
    const currentValue = inputElement.value || "";
    const newValue = currentValue + " " + suggestion.text;
    
    // Update the input value
    if (inputElement.tagName === "TEXTAREA") {
      inputElement.value = newValue;
    } else {
      inputElement.textContent = newValue;
    }
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);
    
    clearSuggestion();
    inputElement.focus();
  }, [suggestion, clearSuggestion]);

  return {
    suggestion,
    loading,
    getSuggestion,
    clearSuggestion,
    acceptSuggestion
  };
};

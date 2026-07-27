const apiClient = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        throw error;
    }
};

export default apiClient;
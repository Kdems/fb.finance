const STORAGE_KEY = "skybar.finance.dashboard.entries.v1";

// Get all entries
function getEntries() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Save all entries
function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// Add new entry
function addEntry(entry) {
  const entries = getEntries();

  const newEntry = {
    id: Date.now().toString(),
    ...entry,
    createdAt: new Date().toISOString()
  };

  entries.push(newEntry);

  saveEntries(entries);

  return newEntry;
}

// Update existing entry
function updateEntry(id, updatedData) {
  const entries = getEntries();

  const updatedEntries = entries.map(entry => {
    if (entry.id === id) {
      return {
        ...entry,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
    }
    return entry;
  });

  saveEntries(updatedEntries);
}

// Delete entry
function deleteEntry(id) {
  const entries = getEntries();

  const filteredEntries = entries.filter(
    entry => entry.id !== id
  );

  saveEntries(filteredEntries);
}

// Get entry by ID
function getEntryById(id) {
  const entries = getEntries();

  return entries.find(
    entry => entry.id === id
  );
}

// Filter by year and month
function filterEntries(year, month) {
  const entries = getEntries();

  return entries.filter(entry => {
    const date = new Date(entry.date);

    const entryYear = date.getFullYear();
    const entryMonth = date.getMonth() + 1;

    return (
      entryYear === year &&
      entryMonth === month
    );
  });
}

import { useState, useRef } from 'react';
import { Search, Upload, Printer, Eye } from 'lucide-react';

interface User {
  Name: string;
  Surname: string;
  Region: string;
  CIN: string;
  "Member until": string;
  Status: string;
  Team: string;
  "Age Group": string;
}

const DUMMY_USERS: User[] = [
  { Name: "Roberto", Surname: "Destri", Region: "South", CIN: "20250001", "Member until": "2027-07-06", Status: "Active", Team: "Team A", "Age Group": "Senior" },
  { Name: "Bernhard", Surname: "Fuss", Region: "North", CIN: "20250002", "Member until": "2027-07-31", Status: "Inactive", Team: "Team D", "Age Group": "Junior" },
  { Name: "Sonja", Surname: "Keppeler", Region: "East", CIN: "20250003", "Member until": "2026-12-15", Status: "Pending", Team: "Team C", "Age Group": "Adult" },
  { Name: "Michael", Surname: "Schmidt", Region: "West", CIN: "20250004", "Member until": "2028-03-20", Status: "Active", Team: "Team B", "Age Group": "Senior" },
  { Name: "Anna", Surname: "Mueller", Region: "South", CIN: "20250005", "Member until": "2027-09-12", Status: "Active", Team: "Team A", "Age Group": "Junior" },
  { Name: "Thomas", Surname: "Weber", Region: "North", CIN: "20250006", "Member until": "2026-11-30", Status: "Pending", Team: "Team D", "Age Group": "Adult" },
  { Name: "Lisa", Surname: "Fischer", Region: "East", CIN: "20250007", "Member until": "2027-05-18", Status: "Active", Team: "Team C", "Age Group": "Senior" },
  { Name: "David", Surname: "Wagner", Region: "West", CIN: "20250008", "Member until": "2028-01-25", Status: "Inactive", Team: "Team B", "Age Group": "Junior" },
  { Name: "Sarah", Surname: "Becker", Region: "South", CIN: "20250009", "Member until": "2027-08-14", Status: "Active", Team: "Team A", "Age Group": "Adult" },
  { Name: "Daniel", Surname: "Schulz", Region: "North", CIN: "20250010", "Member until": "2026-10-22", Status: "Pending", Team: "Team D", "Age Group": "Senior" }
];

const getStorageKey = (cin: string) => `id_photo_${cin}`;

function App() {
  const [searchCIN, setSearchCIN] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const user = DUMMY_USERS.find(u => u.CIN === searchCIN);
    if (user) {
      setSelectedUser(user);
      setError('');
      setShowPreview(false);
      // Load photo from localStorage
      const savedPhoto = localStorage.getItem(getStorageKey(user.CIN));
      setUploadedPhoto(savedPhoto);
    } else {
      setSelectedUser(null);
      setUploadedPhoto(null);
      setError('User not found');
    }
  };

  const handleInputChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
    setSearchCIN(digitsOnly);
    setError('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedPhoto(result);
        // Save to localStorage
        localStorage.setItem(getStorageKey(selectedUser.CIN), result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isValidCIN = searchCIN.length === 8;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 no-print">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Protoype Sample ID Search For Testing Only</h1>
          <p className="text-slate-600">Enter an 8-digit CIN to retrieve member details</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 no-print">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Competitor Identification Number (CIN)
              </label>
              <input
                type="text"
                value={searchCIN}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter 8-digit CIN"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition"
                maxLength={8}
              />
              {searchCIN && !isValidCIN && (
                <p className="text-sm text-red-600 mt-1">CIN must be exactly 8 digits</p>
              )}
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!isValidCIN}
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* ID Card Display */}
        {selectedUser && (
          <div className="max-w-4xl mx-auto">
            {/* Standard ID Card - Credit Card Size Ratio */}
            <div className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-2xl shadow-2xl overflow-hidden print:shadow-lg id-card-container">
              {/* Decorative patterns */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>

              {/* ID Card Content */}
              <div className="relative p-10">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  {/* Photo Section - Left Side */}
                  <div className="flex-shrink-0">
                    <div className="relative w-56 h-64 border-6 border-blue-900 rounded-3xl overflow-hidden bg-white shadow-xl">
                      {uploadedPhoto ? (
                        <img
                          src={uploadedPhoto}
                          alt="ID Photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <div className="text-center">
                            <div className="w-24 h-24 mx-auto bg-slate-300 rounded-full mb-3"></div>
                            <p className="text-slate-500 text-sm font-medium">No Photo</p>
                          </div>
                        </div>
                      )}
                      {!showPreview && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black bg-opacity-60 text-white opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 no-print"
                        >
                          <Upload size={40} />
                          <span className="font-bold text-lg">Add Photo</span>
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Details Section - Right Side */}
                  <div className="flex-1 text-white w-full">
                    {/* Title */}
                    <h2 className="text-5xl font-black mb-8 tracking-tight drop-shadow-lg" style={{ color: '#0000CD' }}>
                      MEMBER ID CARD
                    </h2>

                    {/* Name */}
                    <div className="mb-6">
                      <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0000CD' }}>Name</label>
                      <p className="text-3xl font-black text-black mt-1 drop-shadow">
                        {selectedUser.Name} {selectedUser.Surname}
                      </p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0000CD' }}>CIN Number</label>
                        <p className="text-xl font-black text-black mt-1 drop-shadow">{selectedUser.CIN}</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0000CD' }}>Member Until</label>
                        <p className="text-xl font-black text-black mt-1 drop-shadow">{selectedUser["Member until"]}</p>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0000CD' }}>Region</label>
                        <p className="text-xl font-black text-black mt-1 drop-shadow">{selectedUser.Region}</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0000CD' }}>Team</label>
                        <p className="text-xl font-black text-black mt-1 drop-shadow">{selectedUser.Team}</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0000CD' }}>Age Group</label>
                        <p className="text-xl font-black text-black mt-1 drop-shadow">{selectedUser["Age Group"]}</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0000CD' }}>Status</label>
                        <p className="text-xl font-black text-black mt-1 drop-shadow">{selectedUser.Status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!showPreview && (
              <div className="mt-8 flex flex-wrap gap-4 justify-center no-print">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-8 py-4 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-600 transition flex items-center gap-2 text-lg shadow-lg"
                >
                  <Eye size={24} />
                  Next View
                </button>
                <button
                  onClick={handlePrint}
                  className="px-8 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition flex items-center gap-2 text-lg shadow-lg"
                >
                  <Printer size={24} />
                  Print ID Card
                </button>
              </div>
            )}

            {showPreview && (
              <div className="mt-8">
                <div className="bg-white rounded-xl shadow-lg p-8 no-print">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Preview Mode</h3>
                  <p className="text-center text-slate-600 mb-6">This is how your ID card will appear when printed</p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-8 py-4 bg-slate-500 text-white rounded-xl font-bold hover:bg-slate-400 transition text-lg"
                    >
                      Back to Edit
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-8 py-4 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition flex items-center gap-2 text-lg shadow-lg"
                    >
                      <Printer size={24} />
                      Print Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

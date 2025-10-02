import { useState, useRef, useEffect } from 'react';
import { Search, Eye, Download } from 'lucide-react';
import IDCard from './components/IDCard';

interface User {
  Name: string;
  Surname: string;
  Region: string;
  CIN: string;
  'Member until': string;
  Status: string;
  Team: string;
  'Age Group': string;
}

const DUMMY_USERS: User[] = [
  {
    Name: 'Roberto',
    Surname: 'Destri',
    Region: 'South',
    CIN: '20250001',
    'Member until': '2027-07-06',
    Status: 'Active',
    Team: 'Team A',
    'Age Group': 'Senior',
  },
  {
    Name: 'Daniel',
    Surname: 'Schulz',
    Region: 'North',
    CIN: '20250010',
    'Member until': '2026-10-22',
    Status: 'Pending',
    Team: 'Team D',
    'Age Group': 'Senior',
  },
];

const getStorageKey = (cin: string) => `id_photo_${cin}`;

function App() {
  const [searchCIN, setSearchCIN] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showFullSize, setShowFullSize] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null); // Ref directly to IDCard container

  const handleSearch = () => {
    const user = DUMMY_USERS.find((u) => u.CIN === searchCIN);
    if (user) {
      setSelectedUser(user);
      setError('');
      setShowFullSize(false);
      const saved = localStorage.getItem(getStorageKey(user.CIN));
      setUploadedPhoto(saved);
    } else {
      setSelectedUser(null);
      setUploadedPhoto(null);
      setError('User not found');
    }
  };

  const handleInputChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    setSearchCIN(digits);
    setError('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadedPhoto(result);
        localStorage.setItem(getStorageKey(selectedUser.CIN), result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!selectedUser || !cardRef.current) return;

    // Temporarily remove no-print class to include all content
    const originalClass = cardRef.current.className;
    cardRef.current.className = cardRef.current.className.replace('no-print', '');

    const width = 1080;
    const height = 1920;
    const scale = 2; // Higher resolution for clarity

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = `${width}px`;
    tempContainer.style.height = `${height}px`;

    const cloned = cardRef.current.cloneNode(true) as HTMLElement;
    cloned.style.width = `${width}px`;
    cloned.style.height = `${height}px`;
    cloned.style.transform = `scale(${scale})`;
    tempContainer.appendChild(cloned);
    document.body.appendChild(tempContainer);

    await new Promise((resolve) => setTimeout(resolve, 600)); // Wait for images to load

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(tempContainer, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        width: width * scale,
        height: height * scale,
        backgroundColor: null,
        logging: false,
      });

      const expirationDate = new Date(selectedUser['Member until']).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).toUpperCase(); // Matches IDCard.tsx format
      const downloadDate = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).replace(/[, ]/g, '-').toUpperCase(); // e.g., 10-02-2025-11-59-AM

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PDSF_EID_${selectedUser.CIN}_${selectedUser.Name}_${selectedUser.Surname}_EXP_${expirationDate}_${downloadDate}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Failed to generate image');
    } finally {
      document.body.removeChild(tempContainer);
      cardRef.current.className = originalClass; // Restore original class
    }
  };

  const isValidCIN = searchCIN.length === 8;

  useEffect(() => {
    const show = () => setShowFullSize(true);
    const download = () => handleDownload();
    window.addEventListener('showFullSize', show);
    window.addEventListener('downloadCard', download);
    return () => {
      window.removeEventListener('showFullSize', show);
      window.removeEventListener('downloadCard', download);
    };
  }, [selectedUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Header */}
      <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12 bg-white shadow-md no-print">
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src="/logo.png"
              alt="Philippine DanceSport Federation Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <p className="text-slate-700 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-center">
          Enter an 8-digit CIN to retrieve member details
        </p>
      </div>

      {/* Search */}
      <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 no-print">
        <div className="flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto">
          <div className="w-full text-center">
            <label className="block text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-2">
              Competitor Identification Number (CIN)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchCIN}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter 8-digit CIN"
                className="w-full sm:w-80 md:w-96 lg:w-[28rem] px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center placeholder-gray-500"
              />
              {searchCIN && !isValidCIN && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-red-600 mt-1">
                  CIN must be exactly 8 digits
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={!isValidCIN}
            className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Search size={20} className="w-5 sm:w-6 md:w-7 lg:w-8" />
            Search
          </button>
        </div>
        {error && (
          <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center max-w-md mx-auto">
            {error}
          </div>
        )}
      </div>

      {/* Card (wrapped for capture) */}
      {selectedUser && (
        <div ref={cardRef} className="id-card-wrapper">
          <IDCard
            user={selectedUser}
            uploadedPhoto={uploadedPhoto}
            showFullSize={showFullSize}
            onPhotoUpload={handlePhotoUpload}
            fileInputRef={fileInputRef}
          />
        </div>
      )}

      {/* Full-size modal */}
      {selectedUser && showFullSize && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 no-print">
          <div className="relative max-w-4xl w-full p-4 sm:p-6 md:p-8 lg:p-10">
            <button
              onClick={() => setShowFullSize(false)}
              className="absolute top-2 right-2 z-10 bg-white text-black rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center font-bold hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
            <div className="mx-auto max-w-2xl">
              <IDCard
                user={selectedUser}
                uploadedPhoto={uploadedPhoto}
                showFullSize={true}
                onPhotoUpload={handlePhotoUpload}
                fileInputRef={fileInputRef}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky action buttons (outside the captured area) */}
      {selectedUser && !showFullSize && (
        <div className="flex gap-3 justify-center py-3 sm:py-4 md:py-5 lg:py-6 no-print sticky bottom-0 bg-gray-800 z-10 w-full">
          <button
            onClick={() => setShowFullSize(true)}
            className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-900 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Eye size={16} className="w-4 sm:w-5 md:w-6 lg:w-7" />
            View
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Download size={16} className="w-4 sm:w-5 md:w-6 lg:w-7" />
            Download
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

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

interface IDCardProps {
  user: User;
  uploadedPhoto: string | null;
  showFullSize: boolean;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function IDCard({
  user,
  uploadedPhoto,
  showFullSize,
  onPhotoUpload,
  fileInputRef,
}: IDCardProps) {
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(true);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      .toUpperCase();
  };

  const handleImageLoad = () => setIsBackgroundLoading(false);
  const handlePhotoLoad = () => setIsPhotoLoading(false);
  const handlePhotoError = () => setIsPhotoLoading(false);

  return (
    <div
      ref={cardRef}
      className={`id-card-container ${showFullSize ? 'w-full max-w-4xl h-auto' : ''}`}
      style={{
        backgroundImage: 'url(/id-bg-color.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {isBackgroundLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500 opacity-75">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      <div className="relative h-full flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 text-white">
        {/* Combined Header Section */}
        <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4 lg:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src="/logo.png"
              alt="Philippine DanceSport Federation"
              className="w-16 h-16 sm:w-20 md:w-24 lg:w-28 object-contain bg-white rounded-full p-2 shadow-lg"
              onLoad={handleImageLoad}
              onError={() => setIsBackgroundLoading(false)}
            />
            <div>
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase leading-tight">
                PHILIPPINE DANCESPORT
                FEDERATION, INC.
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-wide mt-1 sm:mt-2">
                MEMBER E-ID CARD
              </h2>
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="relative w-48 h-60 sm:w-60 sm:h-72 md:w-72 md:h-90 lg:w-96 lg:h-120 bg-white rounded-lg overflow-hidden shadow-2xl">
            {uploadedPhoto ? (
              <>
                {isPhotoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-500 opacity-75">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
                <img
                  src={uploadedPhoto}
                  alt="ID Photo"
                  className="w-full h-full object-cover"
                  onLoad={handlePhotoLoad}
                  onError={handlePhotoError}
                  onLoadStart={() => setIsPhotoLoading(true)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center">
                  <div className="w-20 h-20 sm:w-24 md:w-28 lg:w-32 mx-auto bg-gray-300 rounded-full mb-3"></div>
                  <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg font-medium">No Photo</p>
                </div>
              </div>
            )}
            {!showFullSize && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black bg-opacity-60 text-white opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 no-print"
              >
                <Upload size={32} />
                <span className="font-bold text-sm">Add Photo</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Name */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-2">
            {user.Name} {user.Surname}
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium uppercase">FULL NAME</p>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase w-1/2">
              CIN (COMPETITOR IDENTIFICATION NO.)
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black w-1/2 text-right">{user.CIN}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase w-1/2">AGE GROUP</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black w-1/2 text-right">
              {user['Age Group'].toUpperCase()}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase w-1/2">LICENSES</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black w-1/2 text-right">GENERAL</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase w-1/2">MEMBER EXPIRES ON</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black w-1/2 text-right">
              {formatDate(user['Member until'])}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase w-1/2">STATUS</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black w-1/2 text-right">
              {user.Status.toUpperCase()}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase w-1/2">TEAM / REGION</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black w-1/2 text-right">
              {user.Team} - {user.Region.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Footer with Reduced Gap */}
        <div className="text-center mt-1 sm:mt-2 md:mt-3 lg:mt-4">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
            FEDERATION EMAIL ADD.: pdsfi.official@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
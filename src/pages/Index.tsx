import { useState, useRef, FormEvent } from 'react';
import { Upload, User, Loader2, ImageIcon } from 'lucide-react';
import kmccLogo from '@/assets/kmcc-logo.png';
import ImageCropper from '@/components/ImageCropper';
import GeneratedImageView from '@/components/GeneratedImageView';
import { generateFramedImage } from '@/lib/imageGenerator';

const Index = () => {
  const [name, setName] = useState('');
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please upload an image file' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setShowCropper(true);
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (cropped: string) => {
    setCroppedImage(cropped);
    setShowCropper(false);
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!croppedImage) errs.image = 'Please upload and crop your photo';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || !croppedImage) return;
    setIsGenerating(true);
    try {
      const result = await generateFramedImage(croppedImage, name.trim());
      setGeneratedImage(result);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setName('');
    setRawImage(null);
    setCroppedImage(null);
    setGeneratedImage(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (generatedImage) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <GeneratedImageView
          imageData={generatedImage}
          participantName={name}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="gradient-primary py-6 px-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <img src={kmccLogo} alt="KMCC Qatar Logo" className="w-16 h-16 rounded-lg bg-white p-1 shadow" />
          <div>
            <h1 className="text-primary-foreground text-xl sm:text-2xl font-bold font-display leading-tight">
              KMCC Qatar
            </h1>
            <p className="text-primary-foreground/80 text-sm sm:text-base">
              National Sports Day Celebration 2026
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full gradient-gold shadow-md">
                <ImageIcon className="w-7 h-7 text-accent-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-card-foreground font-display">
                Generate Your Photo
              </h2>
              <p className="text-muted-foreground text-sm">
                Upload your photo and create a personalized Sports Day frame!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Participant Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
                {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
              </div>

              {/* Photo upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-1.5">
                  <Upload className="w-4 h-4" /> Upload Photo
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-input rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-green-light/30 transition-colors"
                >
                  {croppedImage ? (
                    <div className="space-y-2">
                      <img
                        src={croppedImage}
                        alt="Cropped preview"
                        className="w-24 h-24 rounded-lg mx-auto object-cover shadow"
                      />
                      <p className="text-sm text-primary font-medium">Photo ready! Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload your photo
                      </p>
                      <p className="text-xs text-muted-foreground">JPG, PNG — Max 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {errors.image && <p className="text-destructive text-xs">{errors.image}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate My Photo ✨'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            10th February 2026 • Asian Town Cricket Stadium
          </p>
        </div>
      </main>

      {/* Cropper modal */}
      {showCropper && rawImage && (
        <ImageCropper
          imageSrc={rawImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default Index;

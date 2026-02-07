import { Download, Share2, RotateCcw } from 'lucide-react';

interface GeneratedImageViewProps {
  imageData: string;
  participantName: string;
  onReset: () => void;
}

const GeneratedImageView = ({ imageData, participantName, onReset }: GeneratedImageViewProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `KMCC_SportsDay_${participantName.replace(/\s+/g, '_')}.png`;
    link.href = imageData;
    link.click();
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'telegram') => {
    const text = encodeURIComponent(
      `🏆 With heartfelt thanks to KMCC Qatar for organizing the National Sports Day Celebration! #KMCCQatar #NationalSportsDay`
    );
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${text}`,
      telegram: `https://t.me/share/url?text=${text}`,
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gradient font-display">
          Your Image is Ready! 🎉
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          With heartfelt thanks to KMCC Qatar for organizing the National Sports Day Celebration.
        </p>
      </div>

      <div className="rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
        <img
          src={imageData}
          alt={`KMCC Sports Day - ${participantName}`} 
          className="w-full h-auto"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          <Download className="w-5 h-5" />
          Download Image
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Create Another
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center font-medium">Share on</p>
        <div className="flex justify-center gap-3">
          {[
            { key: 'whatsapp' as const, label: 'WhatsApp', color: 'bg-[#25D366]' },
            { key: 'facebook' as const, label: 'Facebook', color: 'bg-[#1877F2]' },
            { key: 'telegram' as const, label: 'Telegram', color: 'bg-[#0088cc]' },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => handleShare(key)}
              className={`${color} text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity shadow-md`}
            >
              <Share2 className="w-4 h-4 inline mr-1.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneratedImageView;

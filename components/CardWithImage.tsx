import Image from "next/image";

export const ImageServiceCard = ({
  imageSrc,
  title,
  services,
  desc,
  backgroundColor = "bg-white",
  titleColor = "text-gray-800",
  textColor = "text-gray-600",
  markerColor = "bg-teal-500",
  hoverEffect = true,
  onClick = undefined
}) => {
  return (
    <div
      className={`${backgroundColor} rounded-lg shadow-2xl p-6 flex flex-col items-center text-center ${
        hoverEffect ? 'transition-transform hover:scale-105 cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {/* Render image if provided */}
      {imageSrc && (
        <div className="mb-4">
          <Image src={imageSrc} alt={title || 'Icon'} width={84} height={84} />
        </div>
      )}

      {title && (
        <h2 className={`text-xl font-bold ${titleColor} ${imageSrc ? 'mb-6' : 'mb-4'}`}>
          {title}
        </h2>
      )}

      {title && <div className="w-16 h-px bg-gray-200 mb-6"></div>}

      {desc && (
        <h2 className={`text-sm ${textColor} ${imageSrc ? 'mb-6' : 'mb-4'}`}>
          {desc}
        </h2>
      )}

      {services && services.length > 0 && (
        <div className="w-full text-left space-y-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-1 mr-3">
                <div className={`w-3 h-3 ${markerColor} rounded-sm`}></div>
              </div>
              <p className={`${textColor} text-sm`}>{service}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

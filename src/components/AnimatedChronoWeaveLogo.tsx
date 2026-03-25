import { motion } from "motion/react";
import imgImageChronoWeave from "../assets/chronoweave-logo.png";

function Container2() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[358.72px] opacity-23 rounded-[22369600px] size-[4.244px] top-[447.38px]" data-name="Container" />;
}

function Container3() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[344.1px] opacity-27 rounded-[22369600px] size-[4.59px] top-[123.93px]" data-name="Container" />;
}

function Container4() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[260.84px] opacity-20 rounded-[22369600px] size-[4.005px] top-[543.94px]" data-name="Container" />;
}

function Container5() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[319.8px] opacity-28 rounded-[22369600px] size-[4.397px] top-[258.94px]" data-name="Container" />;
}

function Container6() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[328.32px] opacity-45 rounded-[22369600px] size-[6px] top-[622.13px]" data-name="Container" />;
}

function Container7() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[152.05px] opacity-32 rounded-[22369600px] size-[4.992px] top-[717.09px]" data-name="Container" />;
}

function Container8() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[182.93px] opacity-22 rounded-[22369600px] size-[4.204px] top-[28.3px]" data-name="Container" />;
}

function Container9() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[27.85px] opacity-43 rounded-[22369600px] size-[5.062px] top-[242.06px]" data-name="Container" />;
}

function Container10() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[31.06px] opacity-30 rounded-[22369600px] size-[4.824px] top-[705.97px]" data-name="Container" />;
}

function Container11() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[85.9px] opacity-44 rounded-[22369600px] size-[5.918px] top-[697.19px]" data-name="Container" />;
}

function Container12() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[243.3px] opacity-43 rounded-[22369600px] size-[5.839px] top-[747.35px]" data-name="Container" />;
}

function Container13() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[135.88px] opacity-23 rounded-[22369600px] size-[4.263px] top-[67.39px]" data-name="Container" />;
}

function Container14() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[319.49px] opacity-33 rounded-[22369600px] size-[5.067px] top-[634.67px]" data-name="Container" />;
}

function Container15() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[189.71px] opacity-55 rounded-[22369600px] size-[5.874px] top-[91.22px]" data-name="Container" />;
}

function Container16() {
  return <div className="absolute bg-[rgba(94,234,212,0.3)] left-[8.38px] opacity-29 rounded-[22369600px] size-[4.774px] top-[629.9px]" data-name="Container" />;
}

function Container1() {
  return (
    <div className="absolute h-[816px] left-0 overflow-clip top-0 w-[362px]" data-name="Container">
      <Container2 />
      <Container3 />
      <Container4 />
      <Container5 />
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
      <Container11 />
      <Container12 />
      <Container13 />
      <Container14 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return <div className="absolute h-[120px] left-[181px] top-[312px] w-0" data-name="Container" />;
}

function Container21() {
  return (
    <motion.div 
      className="absolute blur-[20px] left-[-30.99px] opacity-50 rounded-[22369600px] size-[241.989px] top-[-30.99px]" 
      data-name="Container" 
      style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 241.99 241.99\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -17.111 -17.111 0 120.99 120.99)\\'><stop stop-color=\\'rgba(168,85,247,0.15)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(84,43,124,0.075)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }}
      animate={{
        opacity: [0.5, 0.7, 0.5],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

function ImageChronoWeave() {
  return (
    <motion.div 
      className="absolute left-0 size-[180px] top-0" 
      data-name="Image (ChronoWeave)"
      animate={{
        scale: [1, 1.08, 1],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <motion.img 
        alt="ChronoWeave Logo" 
        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
        src={imgImageChronoWeave}
        animate={{
          filter: [
            "drop-shadow(0 0 15px rgba(168,85,247,0.4))",
            "drop-shadow(0 0 25px rgba(168,85,247,0.7))",
            "drop-shadow(0 0 15px rgba(168,85,247,0.4))",
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}

function Container22() {
  return <div className="absolute border-2 border-[rgba(168,85,247,0.3)] border-solid left-[-17.91px] opacity-27 rounded-[22369600px] size-[215.818px] top-[-17.91px]" data-name="Container" />;
}

// Animated orbiting dots
function Container23() {
  return (
    <motion.div 
      className="absolute left-[7.13px] opacity-70 rounded-[22369600px] shadow-[0px_0px_10px_0px_rgba(167,139,250,0.6)] size-[10.358px] top-[162.05px]" 
      data-name="Container" 
      style={{ backgroundImage: "linear-gradient(135deg, rgb(167, 139, 250) 0%, rgb(139, 92, 246) 100%)" }}
      animate={{
        x: [0, -4, 4, 0],
        y: [0, 4, -4, 0],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0
      }}
    />
  );
}

function Container24() {
  return (
    <motion.div 
      className="absolute left-[-20.77px] opacity-80 rounded-[22369600px] shadow-[0px_0px_10px_0px_rgba(167,139,250,0.6)] size-[10.086px] top-[56.29px]" 
      data-name="Container" 
      style={{ backgroundImage: "linear-gradient(135deg, rgb(167, 139, 250) 0%, rgb(139, 92, 246) 100%)" }}
      animate={{
        x: [0, 5, -5, 0],
        y: [0, -4, 4, 0],
        scale: [1, 1.4, 1],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
    />
  );
}

function Container25() {
  return (
    <motion.div 
      className="absolute left-[57.15px] opacity-70 rounded-[22369600px] shadow-[0px_0px_10px_0px_rgba(167,139,250,0.6)] size-[9.638px] top-[-20.71px]" 
      data-name="Container" 
      style={{ backgroundImage: "linear-gradient(135deg, rgb(167, 139, 250) 0%, rgb(139, 92, 246) 100%)" }}
      animate={{
        x: [0, -3, 3, 0],
        y: [0, 3, -3, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 5.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />
  );
}

function Container26() {
  return (
    <motion.div 
      className="absolute left-[163.16px] opacity-59 rounded-[22369600px] shadow-[0px_0px_10px_0px_rgba(167,139,250,0.6)] size-[9.062px] top-[8.24px]" 
      data-name="Container" 
      style={{ backgroundImage: "linear-gradient(135deg, rgb(167, 139, 250) 0%, rgb(139, 92, 246) 100%)" }}
      animate={{
        x: [0, 4, -4, 0],
        y: [0, -4, 4, 0],
        scale: [1, 1.35, 1],
      }}
      transition={{
        duration: 4.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1.5
      }}
    />
  );
}

function Container27() {
  return (
    <motion.div 
      className="absolute left-[191.53px] opacity-46 rounded-[22369600px] shadow-[0px_0px_10px_0px_rgba(167,139,250,0.6)] size-[8.378px] top-[114.48px]" 
      data-name="Container" 
      style={{ backgroundImage: "linear-gradient(135deg, rgb(167, 139, 250) 0%, rgb(139, 92, 246) 100%)" }}
      animate={{
        x: [0, -5, 5, 0],
        y: [0, 5, -5, 0],
        scale: [1, 1.25, 1],
      }}
      transition={{
        duration: 5.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
  );
}

function Container28() {
  return (
    <motion.div 
      className="absolute left-[114.01px] opacity-40 rounded-[22369600px] shadow-[0px_0px_10px_0px_rgba(167,139,250,0.6)] size-[8.042px] top-[191.87px]" 
      data-name="Container" 
      style={{ backgroundImage: "linear-gradient(135deg, rgb(167, 139, 250) 0%, rgb(139, 92, 246) 100%)" }}
      animate={{
        x: [0, 3, -3, 0],
        y: [0, -3, 3, 0],
        scale: [1, 1.22, 1],
      }}
      transition={{
        duration: 4.7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2.5
      }}
    />
  );
}

function Container20() {
  return (
    <div className="absolute left-[59px] size-[180px] top-[50px]" data-name="Container">
      <Container21 />
      <ImageChronoWeave />
      <Container22 />
      <Container23 />
      <Container24 />
      <Container25 />
      <Container26 />
      <Container27 />
      <Container28 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[280px] left-[32px] top-0 w-[298px]" data-name="Container">
      <Container20 />
    </div>
  );
}

function AnimatedIntro1() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="AnimatedIntro">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[36px] left-[103px] not-italic text-[30px] text-center text-white top-[-0.67px] whitespace-nowrap">ChronoWeave</p>
    </div>
  );
}

function AnimatedIntro2() {
  return (
    <div className="font-['Inter:Regular',sans-serif] font-normal h-[48px] leading-[24px] not-italic relative shrink-0 text-[#99a1af] text-[16px] text-center w-full whitespace-nowrap" data-name="AnimatedIntro">
      <p className="-translate-x-1/2 absolute left-[103.3px] top-[-1px]">Understand your unique</p>
      <p className="-translate-x-1/2 absolute left-[102.97px] top-[23px]">relationship with time</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[96px] items-start left-[78.13px] top-[312px] w-[205.75px]" data-name="Container">
      <AnimatedIntro1 />
      <AnimatedIntro2 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[432px] left-0 top-[192px] w-[362px]" data-name="Container">
      <Container18 />
      <Container19 />
      <Container29 />
    </div>
  );
}

function Container31() {
  return (
    <motion.div 
      className="bg-gradient-to-r from-[#5eead4] h-[4px] rounded-[22369600px] shrink-0 to-[#0d9488] w-full" 
      data-name="Container"
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

function Container30() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] content-stretch flex flex-col h-[4px] items-start left-[53px] overflow-clip pr-[83.073px] rounded-[22369600px] top-[764px] w-[256px]" data-name="Container">
      <Container31 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] border-[0.667px] border-[rgba(255,255,255,0.1)] border-solid h-[37.333px] left-[277.59px] rounded-[22369600px] top-[32px] w-[60.406px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[30.5px] not-italic text-[14px] text-[rgba(148,163,184,0.8)] text-center top-[7.67px] whitespace-nowrap">Skip</p>
    </div>
  );
}

function AnimatedIntro() {
  return (
    <div className="bg-[#0f172a] h-[816px] overflow-clip relative shrink-0 w-full" data-name="AnimatedIntro">
      <Container1 />
      <Container17 />
      <Container30 />
      <Button />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#0f172a] content-stretch flex flex-col h-[816px] items-start left-0 overflow-clip rounded-[46px] top-0 w-[362px]" data-name="Container">
      <AnimatedIntro />
    </div>
  );
}

function Container33() {
  return <div className="absolute bg-[#0a0a0a] h-[6px] left-[45px] rounded-[22369600px] top-[15px] w-[60px]" data-name="Container" />;
}

function Container34() {
  return <div className="absolute bg-[#0f172a] border-[#1e293b] border-[0.667px] border-solid left-[114px] rounded-[22369600px] size-[12px] top-[12px]" data-name="Container" />;
}

function Container32() {
  return (
    <div className="absolute bg-black h-[30px] left-[106px] rounded-bl-[24px] rounded-br-[24px] top-0 w-[150px]" data-name="Container">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container35() {
  return <div className="absolute bg-[rgba(255,255,255,0.3)] h-[5px] left-[114px] rounded-[22369600px] top-[803px] w-[134px]" data-name="Container" />;
}

export function AnimatedChronoWeaveLogo() {
  return (
    <div className="bg-black border-14 border-[#1f1f1f] border-solid overflow-clip relative rounded-[60px] shadow-[0px_0px_0px_2px_#3a3a3a,0px_30px_80px_0px_rgba(0,0,0,0.5)] w-[362px] h-[846px]" data-name="logo">
      <Container />
      <Container32 />
      <Container35 />
    </div>
  );
}

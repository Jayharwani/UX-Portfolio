import svgPaths from "./svg-6pxw7op1ag";

function Icon() {
  return (
    <div className="absolute left-[8.74px] size-[13.991px] top-[7px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2a6f1240} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16589" />
          <path d="M11.076 6.99534H2.91472" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16589" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[27.992px] relative rounded-[6.75px] shrink-0 w-[161.528px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27.992px] relative w-[161.528px]">
        <Icon />
        <p className="absolute font-['Poppins:Medium',_sans-serif] leading-[17.5px] left-[34.98px] not-italic text-[12.25px] text-neutral-950 text-nowrap top-[5.25px] whitespace-pre">Back to Dashboard</p>
      </div>
    </div>
  );
}

function Badge() {
  return (
    <div className="h-[22.423px] relative rounded-[6.75px] shrink-0 w-[92.677px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[3.5px] h-[22.423px] items-center justify-center overflow-clip px-[11.213px] py-[4.213px] relative rounded-[inherit] w-[92.677px]">
        <p className="font-['Poppins:Medium',_sans-serif] leading-[14px] not-italic relative shrink-0 text-[10.5px] text-[rgba(0,212,146,0.8)] text-nowrap whitespace-pre">7-Day Report</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.713px] border-[rgba(0,96,69,0.4)] border-solid inset-0 pointer-events-none rounded-[6.75px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[27.992px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Button />
      <Badge />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-neutral-950 h-[56.687px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.713px] border-neutral-800 border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[56.687px] items-start pb-[0.713px] pt-[13.991px] px-[13.991px] relative w-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[34.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
        <g id="Icon">
          <path d={svgPaths.p346c5440} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91658" />
          <path d={svgPaths.p11474580} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.91658" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[rgba(0,188,125,0.7)] content-stretch flex items-center justify-center left-0 rounded-[2.3921e+07px] size-[69.998px] top-0" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p194490f0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45829" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[rgba(254,154,0,0.8)] content-stretch flex items-center justify-center left-[49px] rounded-[2.3921e+07px] size-[27.992px] top-[-7px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute left-[109.44px] size-[69.998px] top-0" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[31.501px] left-0 top-0 w-[288.881px]" data-name="Heading 1">
      <p className="absolute font-['Poppins:SemiBold',_sans-serif] leading-[31.5px] left-[144.59px] not-italic text-[26.25px] text-center text-neutral-50 text-nowrap top-[1.15px] translate-x-[-50%] whitespace-pre">Incredible Progress!</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[48.99px] left-0 top-[38.5px] w-[288.881px]" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[24.5px] left-[144.88px] not-italic text-[#a1a1a1] text-[15.75px] text-center top-[0.71px] translate-x-[-50%] w-[275px]">{`You've reduced phone usage while driving by`}</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[52.498px] left-0 top-[94.48px] w-[288.881px]" data-name="Container">
      <p className="absolute font-['Poppins:Bold',_sans-serif] leading-[52.5px] left-[144.54px] not-italic text-[52.5px] text-[rgba(0,212,146,0.8)] text-center top-[2.31px] translate-x-[-50%] w-[108px]">78%</p>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[19.961px] left-[71.13px] top-0 w-[125.604px]" data-name="Text">
      <p className="absolute font-['Poppins:SemiBold',_sans-serif] leading-[21px] left-[63px] not-italic text-[14px] text-center text-neutral-50 top-0 translate-x-[-50%] w-[126px]">156 fewer pickups</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[20.997px] left-0 top-[153.97px] w-[288.881px]" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[21px] left-[49.28px] not-italic text-[#a1a1a1] text-[14px] text-center text-nowrap top-0 translate-x-[-50%] whitespace-pre">{`That's`}</p>
      <Text />
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[21px] left-[229.74px] not-italic text-[#a1a1a1] text-[14px] text-center top-0 translate-x-[-50%] w-[66px]">in 7 days</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[174.973px] left-0 top-[91px] w-[288.881px]" data-name="Container">
      <Heading1 />
      <Paragraph />
      <Container5 />
      <Paragraph1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[27.992px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Bold',_sans-serif] leading-[28px] left-[43.49px] not-italic text-[21px] text-center text-neutral-50 text-nowrap top-[1.29px] translate-x-[-50%] whitespace-pre">22</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[34.999px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[17.5px] left-[43.61px] not-italic text-[#a1a1a1] text-[12.25px] text-center top-0 translate-x-[-50%] w-[62px]">Avg. Daily Reduction</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.498px] h-[66.489px] items-start left-0 top-0 w-[86.963px]" data-name="Container">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[27.992px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Bold',_sans-serif] leading-[28px] left-[43.86px] not-italic text-[21px] text-center text-neutral-50 text-nowrap top-[1.29px] translate-x-[-50%] whitespace-pre">7</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Poppins:Regular',_sans-serif] grow leading-[17.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#a1a1a1] text-[12.25px] text-center">Days Active</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.498px] h-[66.489px] items-start left-[100.95px] top-0 w-[86.963px]" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[27.992px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Poppins:Bold',_sans-serif] leading-[28px] left-[43.65px] not-italic text-[21px] text-[rgba(0,212,146,0.8)] text-center text-nowrap top-[1.29px] translate-x-[-50%] whitespace-pre">A+</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="basis-0 font-['Poppins:Regular',_sans-serif] grow leading-[17.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#a1a1a1] text-[12.25px] text-center">Safety Grade</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.498px] h-[66.489px] items-start left-[201.91px] top-0 w-[86.974px]" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[66.489px] left-0 top-[293.96px] w-[288.881px]" data-name="Container">
      <Container9 />
      <Container12 />
      <Container15 />
    </div>
  );
}

function ImprovementReport() {
  return (
    <div className="h-[360.449px] relative shrink-0 w-[288.881px]" data-name="ImprovementReport">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[360.449px] relative w-[288.881px]">
        <Container4 />
        <Container6 />
        <Container16 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[410.865px] items-start left-[13.99px] pb-[0.713px] pl-[28.705px] pr-[0.713px] pt-[28.705px] rounded-[12.75px] top-[21px] w-[346.292px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.713px] border-[rgba(0,96,69,0.2)] border-solid inset-0 pointer-events-none rounded-[12.75px]" />
      <ImprovementReport />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[17.5px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.333%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
            <path d={svgPaths.p28378e00} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[rgba(15,23,43,0.3)] relative rounded-[8.75px] shrink-0 size-[31.49px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[6.995px] px-[6.995px] relative size-[31.49px]">
        <Icon3 />
      </div>
    </div>
  );
}

function CardTitle() {
  return (
    <div className="absolute h-[24.495px] left-0 top-0 w-[183.572px]" data-name="CardTitle">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[24.5px] left-0 not-italic text-[15.75px] text-neutral-50 text-nowrap top-[0.71px] whitespace-pre">Weekly Progress</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[34.999px] left-0 top-[24.5px] w-[183.572px]" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[17.5px] left-0 not-italic text-[#a1a1a1] text-[12.25px] top-0 w-[184px]">Phone pickups before vs. after AI settings</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[59.494px] relative shrink-0 w-[183.572px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[59.494px] relative w-[183.572px]">
        <CardTitle />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[59.494px] relative shrink-0 w-[225.555px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.493px] h-[59.494px] items-center relative w-[225.555px]">
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-0 top-0 w-[77.316px]" data-name="Container">
      <p className="basis-0 font-['Poppins:Regular',_sans-serif] grow leading-[17.5px] min-h-px min-w-px not-italic relative shrink-0 text-[#a1a1a1] text-[12.25px] text-right">Trend</p>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-0 size-[10.493px] top-[3.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g clipPath="url(#clip0_80_6023)" id="Icon">
          <path d={svgPaths.p3dad7280} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="0.874417" />
          <path d={svgPaths.pc752628} id="Vector_2" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="0.874417" />
        </g>
        <defs>
          <clipPath id="clip0_80_6023">
            <rect fill="white" height="10.493" width="10.493" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[17.5px] left-0 top-[17.5px] w-[77.316px]" data-name="Container">
      <Icon4 />
      <p className="absolute font-['Poppins:Medium',_sans-serif] leading-[17.5px] left-[77.99px] not-italic text-[12.25px] text-[rgba(0,212,146,0.8)] text-nowrap text-right top-0 translate-x-[-100%] whitespace-pre">Improving</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[34.999px] relative shrink-0 w-[77.316px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[34.999px] relative w-[77.316px]">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function ImprovementReport1() {
  return (
    <div className="absolute content-stretch flex h-[59.494px] items-center justify-between left-[21.71px] top-[21.71px] w-[302.871px]" data-name="ImprovementReport">
      <Container19 />
      <Container22 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[13.39%_4.95%_15.63%_24.75%]" data-name="Group">
      <div className="absolute inset-[84.38%_4.95%_15.63%_24.75%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 213 2">
            <path d="M0 1H212.996" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.63%_4.95%_33.37%_24.75%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 213 2">
            <path d="M0 1H212.996" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[48.88%_4.95%_51.12%_24.75%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 213 2">
            <path d="M0 1H212.996" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[31.14%_4.95%_68.86%_24.75%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 213 2">
            <path d="M0 1H212.996" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_4.95%_86.61%_24.75%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 213 2">
            <path d="M0 1H212.996" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[13.39%_4.95%_15.63%_24.75%]" data-name="Group">
      <div className="absolute inset-[13.39%_70.23%_15.63%_29.77%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_60.18%_15.63%_39.82%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_50.14%_15.63%_49.86%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_40.1%_15.63%_59.9%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_30.06%_15.63%_69.94%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_20.01%_15.63%_79.99%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_9.97%_15.63%_90.03%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_75.25%_15.63%_24.75%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.39%_4.95%_15.63%_95.05%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 159">
            <path d="M1 0V158.997" id="Vector" opacity="0.3" stroke="var(--stroke-0, #374151)" strokeDasharray="3 3" strokeWidth="0.99998" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[13.39%_4.95%_15.63%_24.75%]" data-name="Group">
      <Group />
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[86.39%_66.1%_6.91%_25.65%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[86.39%_66.1%_6.91%_25.65%] leading-[normal] not-italic text-[12px] text-center text-gray-400 text-nowrap whitespace-pre">Mon</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[86.39%_56.72%_6.91%_36.35%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[86.39%_56.72%_6.91%_36.35%] leading-[normal] not-italic text-[12px] text-center text-gray-400 text-nowrap whitespace-pre">Tue</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[86.39%_45.85%_6.91%_45.57%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[86.39%_45.85%_6.91%_45.57%] leading-[normal] not-italic text-[12px] text-center text-gray-400 text-nowrap whitespace-pre">Wed</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[86.39%_36.47%_6.91%_56.27%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[86.39%_36.47%_6.91%_56.27%] leading-[normal] not-italic text-[12px] text-center text-gray-400 text-nowrap whitespace-pre">Thu</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[86.39%_27.58%_6.91%_67.47%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[86.39%_27.58%_6.91%_67.47%] leading-[normal] not-italic text-[12px] text-center text-gray-400 text-nowrap whitespace-pre">Fri</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[86.39%_16.88%_6.91%_76.85%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[86.39%_16.88%_6.91%_76.85%] leading-[normal] not-italic text-[12px] text-center text-gray-400 text-nowrap whitespace-pre">Sat</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[86.39%_6.34%_6.91%_86.4%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[86.39%_6.34%_6.91%_86.4%] leading-[normal] not-italic text-[12px] text-center text-gray-400 text-nowrap whitespace-pre">Sun</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[86.39%_6.34%_6.91%_25.65%]" data-name="Group">
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[86.39%_6.34%_6.91%_25.65%]" data-name="Group">
      <Group10 />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[80.92%_77.89%_12.38%_19.47%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[80.92%_77.89%_12.38%_19.47%] leading-[normal] not-italic text-[12px] text-gray-400 text-nowrap text-right whitespace-pre">0</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[63.17%_77.89%_30.13%_19.47%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[63.17%_77.89%_30.13%_19.47%] leading-[normal] not-italic text-[12px] text-gray-400 text-nowrap text-right whitespace-pre">8</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[45.43%_77.89%_47.88%_17.49%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[45.43%_77.89%_47.88%_17.49%] leading-[normal] not-italic text-[12px] text-gray-400 text-nowrap text-right whitespace-pre">16</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[27.68%_77.89%_65.62%_17.16%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[27.68%_77.89%_65.62%_17.16%] leading-[normal] not-italic text-[12px] text-gray-400 text-nowrap text-right whitespace-pre">24</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[9.94%_77.89%_83.37%_17.16%]" data-name="Group">
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal inset-[9.94%_77.89%_83.37%_17.16%] leading-[normal] not-italic text-[12px] text-gray-400 text-nowrap text-right whitespace-pre">32</p>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[9.94%_77.89%_12.38%_17.16%]" data-name="Group">
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[9.94%_77.89%_12.38%_17.16%]" data-name="Group">
      <Group17 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[31.14%_70.94%_15.63%_25.76%]" data-name="Group">
      <div className="absolute inset-[31.14%_70.94%_15.63%_25.76%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 120">
          <path d={svgPaths.p792b00} fill="var(--fill-0, #991B1B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-[22.27%_60.9%_15.63%_35.8%]" data-name="Group">
      <div className="absolute inset-[22.27%_60.9%_15.63%_35.8%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 140">
          <path d={svgPaths.p2d54ad00} fill="var(--fill-0, #991B1B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[13.39%_50.86%_15.63%_45.84%]" data-name="Group">
      <div className="absolute inset-[13.39%_50.86%_15.63%_45.84%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 159">
          <path d={svgPaths.p1515ec00} fill="var(--fill-0, #991B1B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents inset-[26.7%_40.82%_15.63%_55.88%]" data-name="Group">
      <div className="absolute inset-[26.7%_40.82%_15.63%_55.88%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 130">
          <path d={svgPaths.p5825e00} fill="var(--fill-0, #991B1B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents inset-[17.83%_30.77%_15.63%_65.93%]" data-name="Group">
      <div className="absolute inset-[17.83%_30.77%_15.63%_65.93%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 150">
          <path d={svgPaths.p3e274880} fill="var(--fill-0, #991B1B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents inset-[35.58%_20.73%_15.63%_75.97%]" data-name="Group">
      <div className="absolute inset-[35.58%_20.73%_15.63%_75.97%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 110">
          <path d={svgPaths.p3f4ea80} fill="var(--fill-0, #991B1B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute contents inset-[40.01%_10.69%_15.63%_86.01%]" data-name="Group">
      <div className="absolute inset-[40.01%_10.69%_15.63%_86.01%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 100">
          <path d={svgPaths.p139b5e00} fill="var(--fill-0, #991B1B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents inset-[13.39%_10.69%_15.63%_25.76%]" data-name="Group">
      <Group19 />
      <Group20 />
      <Group21 />
      <Group22 />
      <Group23 />
      <Group24 />
      <Group25 />
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents inset-[13.39%_10.69%_15.63%_25.76%]" data-name="Group">
      <Group26 />
    </div>
  );
}

function RechartsBarRv() {
  return (
    <div className="absolute contents inset-[13.39%_10.69%_15.63%_25.76%]" data-name="recharts-bar-:rv:">
      <Group27 />
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute contents inset-[66.63%_66.32%_15.63%_30.38%]" data-name="Group">
      <div className="absolute inset-[66.63%_66.32%_15.63%_30.38%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 40">
          <path d={svgPaths.p1ddd4e00} fill="var(--fill-0, #059669)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute contents inset-[71.07%_56.28%_15.63%_40.42%]" data-name="Group">
      <div className="absolute inset-[71.07%_56.28%_15.63%_40.42%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 30">
          <path d={svgPaths.pf763d40} fill="var(--fill-0, #059669)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute contents inset-[75.5%_46.24%_15.63%_50.46%]" data-name="Group">
      <div className="absolute inset-[75.5%_46.24%_15.63%_50.46%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 20">
          <path d={svgPaths.p273022c0} fill="var(--fill-0, #059669)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute contents inset-[73.28%_36.2%_15.63%_60.5%]" data-name="Group">
      <div className="absolute inset-[73.28%_36.2%_15.63%_60.5%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 25">
          <path d={svgPaths.p33973400} fill="var(--fill-0, #059669)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute contents inset-[68.85%_26.15%_15.63%_70.55%]" data-name="Group">
      <div className="absolute inset-[68.85%_26.15%_15.63%_70.55%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 35">
          <path d={svgPaths.p3f164800} fill="var(--fill-0, #059669)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute contents inset-[77.72%_16.11%_15.63%_80.59%]" data-name="Group">
      <div className="absolute inset-[77.72%_16.11%_15.63%_80.59%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 15">
          <path d={svgPaths.pd2e6580} fill="var(--fill-0, #059669)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute contents inset-[79.94%_6.07%_15.63%_90.63%]" data-name="Group">
      <div className="absolute inset-[79.94%_6.07%_15.63%_90.63%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
          <path d={svgPaths.p15242780} fill="var(--fill-0, #059669)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute contents inset-[66.63%_6.07%_15.63%_30.38%]" data-name="Group">
      <Group28 />
      <Group29 />
      <Group30 />
      <Group31 />
      <Group32 />
      <Group33 />
      <Group34 />
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute contents inset-[66.63%_6.07%_15.63%_30.38%]" data-name="Group">
      <Group35 />
    </div>
  );
}

function RechartsBarR10() {
  return (
    <div className="absolute contents inset-[66.63%_6.07%_15.63%_30.38%]" data-name="recharts-bar-:r10:">
      <Group36 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[223.996px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group2 />
      <Group11 />
      <Group18 />
      <RechartsBarRv />
      <RechartsBarR10 />
    </div>
  );
}

function ImprovementReport2() {
  return (
    <div className="content-stretch flex flex-col h-[223.996px] items-start relative shrink-0 w-full" data-name="ImprovementReport">
      <Icon5 />
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-[rgba(159,7,18,0.6)] relative rounded-[3.5px] shrink-0 size-[10.493px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[10.493px]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[106.167px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[17.5px] items-start relative w-[106.167px]">
        <p className="font-['Poppins:Regular',_sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[#a1a1a1] text-[12.25px] text-nowrap whitespace-pre">Before AI Settings</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[123.655px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6.995px] h-[17.5px] items-center relative w-[123.655px]">
        <Container23 />
        <Text1 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[rgba(0,153,102,0.8)] relative rounded-[3.5px] shrink-0 size-[10.493px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[10.493px]" />
    </div>
  );
}

function Text2() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[17.5px] items-start relative w-full">
        <p className="font-['Poppins:Regular',_sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[#a1a1a1] text-[12.25px] text-nowrap whitespace-pre">After AI Settings</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[113.429px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[6.995px] h-[17.5px] items-center relative w-[113.429px]">
        <Container25 />
        <Text2 />
      </div>
    </div>
  );
}

function ImprovementReport3() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="ImprovementReport">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[20.997px] h-[17.5px] items-center justify-center pl-0 pr-[0.011px] py-0 relative w-full">
          <Container24 />
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function CardContent() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[13.991px] h-[276.483px] items-start left-[0.71px] pl-[20.997px] pr-[20.875px] py-0 top-[121.44px] w-[344.866px]" data-name="CardContent">
      <ImprovementReport2 />
      <ImprovementReport3 />
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-neutral-950 h-[398.634px] left-[13.99px] rounded-[12.75px] top-[452.86px] w-[346.292px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.713px] border-[rgba(29,41,61,0.3)] border-solid inset-0 pointer-events-none rounded-[12.75px]" />
      <ImprovementReport1 />
      <CardContent />
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[17.5px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[53.71%_29.17%_8.34%_29.18%]" data-name="Vector">
        <div className="absolute inset-[-10.98%_-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9">
            <path d={svgPaths.p273fc400} id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-1/4 right-1/4 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-8.333%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
            <path d={svgPaths.p3a85a480} id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-[rgba(123,51,6,0.2)] relative rounded-[8.75px] shrink-0 size-[31.49px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[6.995px] px-[6.995px] relative size-[31.49px]">
        <Icon6 />
      </div>
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="absolute h-[24.495px] left-0 top-0 w-[198.12px]" data-name="CardTitle">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[24.5px] left-0 not-italic text-[15.75px] text-neutral-50 text-nowrap top-[0.71px] whitespace-pre">Achievements Unlocked</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute content-stretch flex h-[17.5px] items-start left-0 top-[24.5px] w-[198.12px]" data-name="Paragraph">
      <p className="font-['Poppins:Regular',_sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[#a1a1a1] text-[12.25px] text-nowrap whitespace-pre">Your safety milestones this week</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[41.994px] relative shrink-0 w-[198.12px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[41.994px] relative w-[198.12px]">
        <CardTitle1 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function ImprovementReport4() {
  return (
    <div className="h-[41.994px] relative shrink-0 w-[302.871px]" data-name="ImprovementReport">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.493px] h-[41.994px] items-center relative w-[302.871px]">
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p8009b5c} id="Vector" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
          <path d={svgPaths.p20607000} id="Vector_2" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
          <path d={svgPaths.p202625c0} id="Vector_3" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
          <path d="M2.91658 16.0412H14.5829" id="Vector_4" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
          <path d={svgPaths.p3e2cff00} id="Vector_5" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
          <path d={svgPaths.p65e4fc0} id="Vector_6" stroke="var(--stroke-0, #FFB900)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-neutral-950 relative rounded-[8.75px] shrink-0 size-[41.994px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.713px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center pl-[0.713px] pr-[0.724px] py-[0.713px] relative size-[41.994px]">
        <Icon7 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[20.997px] relative shrink-0 w-[123.332px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20.997px] items-start relative w-[123.332px]">
        <p className="font-['Poppins:Medium',_sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-neutral-50 text-nowrap whitespace-pre">Safety Champion</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[13.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_80_5979)" id="Icon">
          <path d={svgPaths.p36e8c500} id="Vector" stroke="var(--stroke-0, #00BC7D)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.16589" />
          <path d={svgPaths.p217b5800} id="Vector_2" stroke="var(--stroke-0, #00BC7D)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.16589" />
        </g>
        <defs>
          <clipPath id="clip0_80_5979">
            <rect fill="white" height="13.9907" width="13.9907" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[20.997px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[20.997px] items-center justify-between relative w-full">
          <Heading3 />
          <Icon8 />
        </div>
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Poppins:Regular',_sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[#a1a1a1] text-[12.25px] text-nowrap whitespace-pre">78% fewer distractions while driving</p>
    </div>
  );
}

function Container31() {
  return <div className="bg-[rgba(255,185,0,0.6)] h-[6.995px] rounded-[2.3921e+07px] shrink-0 w-full" data-name="Container" />;
}

function Container32() {
  return (
    <div className="bg-neutral-800 content-stretch flex flex-col h-[6.995px] items-start relative rounded-[2.3921e+07px] shrink-0 w-full" data-name="Container">
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="basis-0 grow h-[59.483px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[6.995px] h-[59.483px] items-start relative w-full">
        <Container30 />
        <Paragraph4 />
        <Container32 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[rgba(38,38,38,0.2)] h-[88.89px] relative rounded-[8.75px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.713px] border-[rgba(38,38,38,0.3)] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[13.991px] h-[88.89px] items-center px-[14.704px] py-[0.713px] relative w-full">
          <Container29 />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p2795ad00} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45829" />
          <path d={svgPaths.pe662c00} id="Vector_2" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45829" />
          <path d={svgPaths.p1f0d9c80} id="Vector_3" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45829" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-neutral-950 relative rounded-[8.75px] shrink-0 size-[41.994px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.713px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center pl-[0.713px] pr-[0.724px] py-[0.713px] relative size-[41.994px]">
        <Icon9 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[20.997px] relative shrink-0 w-[93.245px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20.997px] items-start relative w-[93.245px]">
        <p className="font-['Poppins:Medium',_sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-neutral-50 text-nowrap whitespace-pre">Focus Master</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[13.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_80_5979)" id="Icon">
          <path d={svgPaths.p36e8c500} id="Vector" stroke="var(--stroke-0, #00BC7D)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.16589" />
          <path d={svgPaths.p217b5800} id="Vector_2" stroke="var(--stroke-0, #00BC7D)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.16589" />
        </g>
        <defs>
          <clipPath id="clip0_80_5979">
            <rect fill="white" height="13.9907" width="13.9907" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[20.997px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[20.997px] items-center justify-between relative w-full">
          <Heading4 />
          <Icon10 />
        </div>
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[34.999px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[17.5px] left-0 not-italic text-[#a1a1a1] text-[12.25px] top-0 w-[151px]">Maintained settings for 7 consecutive days</p>
    </div>
  );
}

function Container37() {
  return <div className="bg-[rgba(144,161,185,0.6)] h-[6.995px] rounded-[2.3921e+07px] shrink-0 w-full" data-name="Container" />;
}

function Container38() {
  return (
    <div className="bg-neutral-800 content-stretch flex flex-col h-[6.995px] items-start relative rounded-[2.3921e+07px] shrink-0 w-full" data-name="Container">
      <Container37 />
    </div>
  );
}

function Container39() {
  return (
    <div className="basis-0 grow h-[76.982px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[6.995px] h-[76.982px] items-start relative w-full">
        <Container36 />
        <Paragraph5 />
        <Container38 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-[rgba(38,38,38,0.2)] h-[106.389px] relative rounded-[8.75px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.713px] border-[rgba(38,38,38,0.3)] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[13.991px] h-[106.389px] items-center px-[14.704px] py-[0.713px] relative w-full">
          <Container35 />
          <Container39 />
        </div>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3f46da00} id="Vector" stroke="var(--stroke-0, #00D492)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.45829" />
        </g>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-neutral-950 relative rounded-[8.75px] shrink-0 size-[41.994px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.713px] border-neutral-800 border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center pl-[0.713px] pr-[0.724px] py-[0.713px] relative size-[41.994px]">
        <Icon11 />
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[20.997px] relative shrink-0 w-[92.61px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20.997px] items-start relative w-[92.61px]">
        <p className="font-['Poppins:Medium',_sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-neutral-50 text-nowrap whitespace-pre">Road Warrior</p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[13.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_80_5979)" id="Icon">
          <path d={svgPaths.p36e8c500} id="Vector" stroke="var(--stroke-0, #00BC7D)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.16589" />
          <path d={svgPaths.p217b5800} id="Vector_2" stroke="var(--stroke-0, #00BC7D)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.16589" />
        </g>
        <defs>
          <clipPath id="clip0_80_5979">
            <rect fill="white" height="13.9907" width="13.9907" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[20.997px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex h-[20.997px] items-center justify-between relative w-full">
          <Heading5 />
          <Icon12 />
        </div>
      </div>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[34.999px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[17.5px] left-0 not-italic text-[#a1a1a1] text-[12.25px] top-0 w-[145px]">Zero high-speed phone interactions</p>
    </div>
  );
}

function Container43() {
  return <div className="bg-[rgba(0,212,146,0.6)] h-[6.995px] rounded-[2.3921e+07px] shrink-0 w-full" data-name="Container" />;
}

function Container44() {
  return (
    <div className="bg-neutral-800 content-stretch flex flex-col h-[6.995px] items-start relative rounded-[2.3921e+07px] shrink-0 w-full" data-name="Container">
      <Container43 />
    </div>
  );
}

function Container45() {
  return (
    <div className="basis-0 grow h-[76.982px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[6.995px] h-[76.982px] items-start relative w-full">
        <Container42 />
        <Paragraph6 />
        <Container44 />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="bg-[rgba(38,38,38,0.2)] h-[106.389px] relative rounded-[8.75px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.713px] border-[rgba(38,38,38,0.3)] border-solid inset-0 pointer-events-none rounded-[8.75px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[13.991px] h-[106.389px] items-center px-[14.704px] py-[0.713px] relative w-full">
          <Container41 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function ImprovementReport5() {
  return (
    <div className="h-[329.65px] relative shrink-0 w-[302.871px]" data-name="ImprovementReport">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[13.991px] h-[329.65px] items-start relative w-[302.871px]">
        <Container34 />
        <Container40 />
        <Container46 />
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-neutral-950 box-border content-stretch flex flex-col gap-[40.234px] h-[455.299px] items-start left-[13.99px] pb-[0.713px] pl-[21.71px] pr-[0.713px] pt-[21.71px] rounded-[12.75px] top-[872.49px] w-[346.292px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.713px] border-[rgba(151,60,0,0.2)] border-solid inset-0 pointer-events-none rounded-[12.75px]" />
      <ImprovementReport4 />
      <ImprovementReport5 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="h-[17.5px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.32%_12.49%]" data-name="Vector">
        <div className="absolute inset-[-5%_-5.55%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 17">
            <path d={svgPaths.p2d528f80} id="Vector" stroke="var(--stroke-0, #FAFAFA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45829" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-[rgba(250,250,250,0.1)] relative rounded-[8.75px] shrink-0 size-[31.49px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start pb-0 pt-[6.995px] px-[6.995px] relative size-[31.49px]">
        <Icon13 />
      </div>
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="h-[24.495px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[24.5px] left-0 not-italic text-[15.75px] text-neutral-50 text-nowrap top-[0.71px] whitespace-pre">Keep It Up!</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex h-[17.5px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Poppins:Regular',_sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[#a1a1a1] text-[12.25px] text-nowrap whitespace-pre">Your AI settings are working great</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[41.994px] relative shrink-0 w-[204.959px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[4.768e_-5px] h-[41.994px] items-start relative w-[204.959px]">
        <CardTitle2 />
        <Paragraph7 />
      </div>
    </div>
  );
}

function ImprovementReport6() {
  return (
    <div className="h-[41.994px] relative shrink-0 w-[302.871px]" data-name="ImprovementReport">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.493px] h-[41.994px] items-center relative w-[302.871px]">
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[13.991px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_80_5969)" id="Icon">
          <path d={svgPaths.pf34f900} id="Vector" stroke="var(--stroke-0, #FF6E06)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16589" />
        </g>
        <defs>
          <clipPath id="clip0_80_5969">
            <rect fill="white" height="13.9907" width="13.9907" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20.997px] relative shrink-0 w-[207.989px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20.997px] items-start relative w-[207.989px]">
        <p className="font-['Poppins:Medium',_sans-serif] leading-[21px] not-italic relative shrink-0 text-[#ff6e06] text-[14px] text-nowrap whitespace-pre">Moderate AI Protection Active</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex gap-[6.995px] h-[20.997px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon14 />
      <Text3 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[52.498px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[17.5px] left-0 not-italic text-[#a1a1a1] text-[12.25px] top-0 w-[270px]">Your current settings are perfectly balanced for your driving habits. Continue to monitor your progress and adjust if needed.</p>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[10.493px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g clipPath="url(#clip0_80_5966)" id="Icon">
          <path d={svgPaths.p14aabe72} id="Vector" stroke="var(--stroke-0, #A1A1A1)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.874417" />
        </g>
        <defs>
          <clipPath id="clip0_80_5966">
            <rect fill="white" height="10.493" width="10.493" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[14.002px] relative shrink-0 w-[199.3px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[14.002px] relative w-[199.3px]">
        <p className="absolute font-['Poppins:Regular',_sans-serif] leading-[14px] left-0 not-italic text-[#a1a1a1] text-[10.5px] text-nowrap top-[0.29px] whitespace-pre">Auto-activates when driving detected</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex gap-[6.995px] h-[14.002px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon15 />
      <Text4 />
    </div>
  );
}

function ImprovementReport7() {
  return (
    <div className="bg-[rgba(38,38,38,0.3)] h-[136.465px] relative rounded-[8.75px] shrink-0 w-[302.871px]" data-name="ImprovementReport">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[10.493px] h-[136.465px] items-start pb-0 pt-[13.991px] px-[13.991px] relative w-[302.871px]">
        <Container49 />
        <Paragraph8 />
        <Container50 />
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-neutral-950 box-border content-stretch flex flex-col gap-[40.234px] h-[262.114px] items-start left-[13.99px] pb-[0.713px] pl-[21.71px] pr-[0.713px] pt-[21.71px] rounded-[12.75px] top-[1348.79px] w-[346.292px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.713px] border-[rgba(250,250,250,0.2)] border-solid inset-0 pointer-events-none rounded-[12.75px]" />
      <ImprovementReport6 />
      <ImprovementReport7 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[rgba(69,85,108,0.8)] box-border content-stretch flex gap-[7px] h-[34.999px] items-center justify-center left-[96.13px] px-[28px] py-0 rounded-[6.75px] top-[1645.89px] w-[182.001px]" data-name="Button">
      <p className="font-['Poppins:Medium',_sans-serif] leading-[17.5px] not-italic relative shrink-0 text-[12.25px] text-nowrap text-white whitespace-pre">Continue Monitoring</p>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[1701.88px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
      <Button1 />
    </div>
  );
}

function ImprovementReport8() {
  return (
    <div className="bg-neutral-950 content-stretch flex flex-col h-[1758.57px] items-start relative shrink-0 w-full" data-name="ImprovementReport">
      <Container1 />
      <Container51 />
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-neutral-950 content-stretch flex flex-col h-[1758.57px] items-start left-0 top-0 w-[374.273px]" data-name="App">
      <ImprovementReport8 />
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute content-stretch flex h-[17.99px] items-start left-0 top-[-20000px] w-[7.575px]" data-name="Text">
      <p className="font-['Poppins:Regular',_sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-neutral-950 text-nowrap whitespace-pre">8</p>
    </div>
  );
}

export default function Component13() {
  return (
    <div className="bg-white relative size-full" data-name="13">
      <App />
      <Text5 />
    </div>
  );
}
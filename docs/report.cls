\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{report}

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax
\LoadClass[12pt,a4paper]{article}

\RequirePackage[utf8]{vntex,inputenc}
\RequirePackage{anyfontsize,amsmath,amssymb}
\RequirePackage{fourier}
\RequirePackage[T5]{fontenc}
\RequirePackage{lastpage}
\RequirePackage{geometry,graphicx,indentfirst,setspace}
\RequirePackage{booktabs}
\RequirePackage[center]{caption}

\RequirePackage{fancyhdr,hyperref}
% \RequirePackage[super,square,sort]{natbib}

% Change to '[english,vietnamese]' to use Vietnamese labels
\RequirePackage[vietnamese]{babel}

% Custom commands
\newcommand{\Month}{
  \ifcase \the\month
  \or Tháng 1
  \or Tháng 2
  \or Tháng 3
  \or Tháng 4
  \or Tháng 5
  \or Tháng 6
  \or Tháng 7
  \or Tháng 8
  \or Tháng 9
  \or Tháng 10
  \or Tháng 11
  \or Tháng 12
  \fi
}

\newcommand{\@upperuniname}{Đại học quốc gia Thành phố Hồ Chí Minh}
\newcommand{\@uniname}{Trường Đại học Công nghệ Thông tin}

\newcommand{\@deptname}{Khoa Khoa học Máy tính}
\newcommand{\deptname}[1]{\renewcommand{\@deptname}{#1}}

\newcommand{\@coursename}{Course name}
\newcommand{\coursename}[1]{\renewcommand{\@coursename}{#1}}

\newcommand{\@reporttype}{Assignment Report}
\newcommand{\reporttype}[1]{\renewcommand{\@reporttype}{#1}}

\renewcommand{\@title}{Report title}

\newcommand{\@advisor}{Advisor}
\newcommand{\advisor}[1]{\renewcommand{\@advisor}{#1}}

\newcommand{\@stuname}{STUDENT:\ Tang Nhat (22521027)}
\newcommand{\stuname}[1]{\renewcommand{\@stuname}{#1}}

\newcommand{\@reportplace}{Thành phố Hồ Chí Minh}
\newcommand{\reportplace}[1]{\renewcommand{\@reportplace}{#1}}

\newcommand{\@reporttime}{\Month \the\year}
\newcommand{\reporttime}[1]{\renewcommand{\@reporttime}{#1}}

% Configurations
%\graphicspath{{subdir1/}{subdir2/}{subdir3/}...{subdirn/}}

\geometry{
  paper=a4paper,
  left=2cm,
  right=2cm,
  vmargin=2cm,
  includeheadfoot=true,
  headheight=35pt
}

\onehalfspacing
\raggedbottom
\renewcommand{\arraystretch}{1.2}

% Set depth of numbering for sections and table of contents
\setcounter{secnumdepth}{3}
\setcounter{tocdepth}{3}

% Set depth of numbering for counters
\AtBeginDocument{\counterwithin{equation}{section}}
% \AtBeginDocument{\counterwithin{table}{section}}
\AtBeginDocument{\counterwithin{figure}{section}}

\AtBeginDocument{\renewcommand*\bibname{References}}

\hypersetup{
  colorlinks=true,
  linkcolor=black,
  citecolor=red,
  urlcolor=blue
}

\renewcommand{\headrulewidth}{0.3pt}
\renewcommand{\footrulewidth}{0.3pt}

\pagestyle{fancy}
\fancyhf{}

%\renewcommand{\subsectionmark}[1]{\markright{\thesubsection.\ #1}}

% The drawing units are interpreted as multiples of \unitlength
% unless a unit is given
%\setlength{\unitlength}{1pt}

\if@twoside
  \fancyhead[EL]{
    \bfseries
    \begin{tabular}{rl}
      \begin{picture}(25pt,15pt)
        \put(0,-8pt){\includegraphics[width=30pt]{assets/logos/logo-uit.png}}
      \end{picture}
      \begin{tabular}{l}
        \ttfamily\@uniname \\
        \ttfamily\@deptname \\
      \end{tabular}
    \end{tabular}
  }
  \fancyhead[OR]{
    \bfseries
    \begin{tabular}{rl}
      \begin{tabular}{r}
        \ttfamily\@uniname \\
        \ttfamily\@deptname \\
      \end{tabular}
      \begin{picture}(25pt,15pt)
        \put(0,-8pt){\includegraphics[width=30pt]{assets/logos/logo-uit.png}}
      \end{picture}
    \end{tabular}
  }
\else
\fancyhead[OR]{
  \bfseries
  \begin{tabular}{rl}
    \begin{tabular}{r}
      \ttfamily\@uniname \\
      \ttfamily\@deptname \\
    \end{tabular}
    \begin{picture}(25pt,15pt)
      \put(0,-8pt){\includegraphics[width=30pt]{assets/logos/logo-uit.png}}
    \end{picture}
  \end{tabular}
}

\fi
\fancyfoot{} % clear all footer fields
\fancyfoot[R]{\scriptsize \ttfamily Trang {\thepage}/\pageref{LastPage}}
\fancyfoot[L]{\scriptsize \ttfamily Bài tập môn Đồ họa Máy tính}
\renewcommand{\footrulewidth}{0.3pt}

% Custom pages and sections
\newcommand{\coverpage}{
  \pagestyle{empty}

  \vspace*{-3\baselineskip}
  \begin{center}
    \MakeUppercase{\@upperuniname}

    \MakeUppercase{\@uniname}

    \MakeUppercase{\@deptname}
    \vfill
    \includegraphics[scale=0.2]{assets/logos/logo-uit.png}
    \vfill
    \bfseries
    \begin{tabular}{c}
      \Large\@coursename                                 \\
      {}                                                 \\
      \midrule                                           \\
      \LARGE\@reporttype                                 \\
      {}                                                 \\
      \Huge\parbox[c]{0.8\linewidth}{\centering \@title} \\
      {}                                                 \\
      \bottomrule
    \end{tabular}
    \vfill
    \mdseries
    \begin{tabular}{rll}
      \large \textbf{GVHD}: \@advisor \\
      \large \textbf{SV thực hiện}: \@stuname \\
    \end{tabular}
    \vfill
    \@reportplace, \@reporttime
  \end{center}
  \pagebreak
  \pagestyle{fancy}
}

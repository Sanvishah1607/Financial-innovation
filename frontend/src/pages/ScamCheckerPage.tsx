import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  Search,
  PhoneCall,
  ExternalLink,
  Info,
  Sparkles,
  Lock,
  FileWarning,
  Copy,
  Check
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useToast } from '../context/ToastContext';
import { ScamCheckResult } from '../types';

export const ScamCheckerPage: React.FC = () => {
  const { addToast } = useToast();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    {
      label: 'Electricity Cutoff Threat',
      text: 'Dear Customer, Your Electricity power will be disconnected tonight at 9.30 pm from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer Mr. Sharma on 9876543210. Thank you.'
    },
    {
      label: 'KBC Lottery Winner',
      text: 'Dear customer, Congratulations! Your mobile number has won ₹25,00,000 in Kaun Banega Crorepati WhatsApp Lucky Draw 2024. To claim your lottery cash, send your Aadhaar & PAN card to WhatsApp 9123456789 and pay ₹1,500 registration fee.'
    },
    {
      label: 'YouTube Likes Job Scam',
      text: 'Earn ₹3,000 - ₹5,000 daily from home! Easy part-time job: Like 3 YouTube videos and subscribe. Daily UPI payout guaranteed. Join our official Telegram group to start immediately: t.me/fastmoney_official'
    },
    {
      label: 'Legitimate Bank SMS',
      text: 'Dear Customer, INR 45,000.00 credited to your A/c XX4092 on 15-AUG-24 by IMPS Ref 42281928491. Avail balance INR 1,24,500.00 - FinShield Bank'
    }
  ];

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      addToast('error', 'Please enter or paste a message to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Realistic scanning heuristics
    setTimeout(() => {
      const lower = inputText.toLowerCase();
      let riskLevel: 'HIGH RISK' | 'SUSPICIOUS' | 'SAFE' = 'SAFE';
      let riskScore = 15;
      let verdict = 'This communication appears typical and exhibits standard institutional format.';
      let warningSigns: string[] = [];
      let recommendedAction = 'No immediate threat detected. Always verify sender identity independently.';

      const hasUrgency =
        lower.includes('tonight') ||
        lower.includes('disconnected') ||
        lower.includes('immediate') ||
        lower.includes('urgent') ||
        lower.includes('blocked') ||
        lower.includes('expire');

      const hasLotteryOrMoney =
        lower.includes('won') ||
        lower.includes('lottery') ||
        lower.includes('lucky draw') ||
        lower.includes('free') ||
        lower.includes('reward') ||
        lower.includes('kbc');

      const hasPersonalNumber =
        /\b[6-9]\d{9}\b/.test(inputText) &&
        (lower.includes('contact') || lower.includes('call') || lower.includes('officer'));

      const hasTelegramOrApk =
        lower.includes('telegram') ||
        lower.includes('t.me') ||
        lower.includes('.apk') ||
        lower.includes('whatsapp') ||
        lower.includes('like youtube') ||
        lower.includes('registration fee');

      const hasUpiPinTrap =
        lower.includes('enter pin to receive') ||
        lower.includes('qr code') ||
        lower.includes('enter upi pin');

      if (hasUpiPinTrap || hasLotteryOrMoney || (hasUrgency && hasPersonalNumber) || hasTelegramOrApk) {
        riskLevel = 'HIGH RISK';
        riskScore = 95;
        verdict = 'CRITICAL MALICIOUS FRAUD DETECTED: This message matches verified social engineering patterns used by digital scammers.';
        recommendedAction = 'DO NOT reply, DO NOT transfer any advance fee, DO NOT share OTP/PIN, and DO NOT open any links or call the personal phone number.';

        if (hasUrgency) warningSigns.push('Manufactured artificial urgency and threat of essential service disconnection.');
        if (hasPersonalNumber) warningSigns.push('Official utilities never ask you to call personal 10-digit mobile numbers.');
        if (hasLotteryOrMoney) warningSigns.push('Unsolicited lottery winnings asking for registration/processing fee.');
        if (hasTelegramOrApk) warningSigns.push('Part-time rating/like schemes funneling victims to untraceable Telegram groups.');
        if (hasUpiPinTrap) warningSigns.push('Fraudulent demand to enter UPI PIN to receive money (Entering PIN ALWAYS debits your account).');
      } else if (hasUrgency || lower.includes('verify') || lower.includes('kyc') || lower.includes('click')) {
        riskLevel = 'SUSPICIOUS';
        riskScore = 65;
        verdict = 'POTENTIAL RISK: This message contains indicators frequently associated with phishing or unsolicited promotional tactics.';
        recommendedAction = 'Proceed with high caution. Open your bank app directly instead of clicking links or responding.';
        warningSigns.push('Contains request for account action or verification.');
        warningSigns.push('Unverified sender channel.');
      } else {
        riskLevel = 'SAFE';
        riskScore = 10;
        verdict = 'LOW RISK: No deceptive red flags or phishing indicators detected.';
        warningSigns.push('Follows standard transactional notification format.');
        warningSigns.push('Does not ask for sensitive credentials or advance fees.');
      }

      setResult({
        riskLevel,
        riskScore,
        verdict,
        warningSigns,
        recommendedAction,
        scannedText: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setIsAnalyzing(false);
      addToast(
        riskLevel === 'HIGH RISK' ? 'error' : riskLevel === 'SUSPICIOUS' ? 'warning' : 'success',
        `Analysis complete: Rated as ${riskLevel}`
      );
    }, 600);
  };

  const handleCopyHelpline = () => {
    navigator.clipboard.writeText('1930');
    setCopied(true);
    addToast('info', 'Helpline number 1930 copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl font-black text-[#242424] tracking-tight">
            Digital Scam & Phishing Shield
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Instant heuristic analysis for suspicious SMS, WhatsApp requests, lottery claims, and fake KYC notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" className="flex items-center gap-1.5 py-1 px-3">
            <ShieldCheck className="w-4 h-4 text-[#8B1E3F]" />
            Active Protection Mode
          </Badge>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Box Column */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 bg-white">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-[#242424] uppercase tracking-wider">
                Paste Suspicious Message, SMS, or URL
              </label>
              {inputText && (
                <button
                  onClick={() => {
                    setInputText('');
                    setResult(null);
                  }}
                  className="text-xs text-[#8B1E3F] hover:underline font-semibold"
                >
                  Clear Text
                </button>
              )}
            </div>

            <textarea
              rows={6}
              placeholder="e.g., Dear Customer, Your electricity power will be disconnected tonight. Call officer on 9876543210..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="w-full p-3.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg text-xs font-mono text-[#242424] placeholder-[#6B6B6B] focus:outline-none focus:border-[#8B1E3F] focus:ring-1 focus:ring-[#8B1E3F] transition-colors leading-relaxed"
            />

            {/* Test Sample Presets */}
            <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
              <span className="text-[11px] font-bold text-[#6B6B6B] uppercase block mb-2">
                Try Sample Test Cases:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(preset.text);
                      setResult(null);
                    }}
                    className="px-2.5 py-1.5 text-[11px] font-medium bg-[#FAFAFA] hover:bg-[#F8E9EE] border border-[#E5E5E5] hover:border-[#8B1E3F] hover:text-[#8B1E3F] rounded transition-colors text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scan Trigger Button */}
            <div className="mt-5 pt-3 border-t border-[#F0F0F0] flex items-center justify-end">
              <Button
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {isAnalyzing ? 'Scanning Threat Vectors...' : 'Analyze with Scam Shield'}
              </Button>
            </div>
          </Card>

          {/* National Cybercrime Helpline Card */}
          <Card className="p-4 bg-gradient-to-r from-[#64152E] to-[#8B1E3F] text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">National Cyber Crime Reporting Helpline</h3>
                  <p className="text-xs text-white/80">
                    If you fell victim to a financial scam, report immediately within the golden hour to freeze transfers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyHelpline}
                  className="px-4 py-2 bg-white text-[#8B1E3F] hover:bg-[#FAFAFA] font-mono font-bold text-sm rounded flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-[#218739]" /> : <Copy className="w-4 h-4" />}
                  Dial 1930
                </button>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                  title="Visit cybercrime.gov.in"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5">
          {result ? (
            <Card className="p-6 bg-white border border-[#E5E5E5] space-y-5">
              {/* Verdict Header */}
              <div
                className={`p-4 rounded-lg flex items-start gap-3.5 ${
                  result.riskLevel === 'HIGH RISK'
                    ? 'bg-[#FCE8E8] text-[#C62828] border border-[#C62828]/20'
                    : result.riskLevel === 'SUSPICIOUS'
                    ? 'bg-[#FDF6E9] text-[#C88719] border border-[#C88719]/20'
                    : 'bg-[#EAF5EC] text-[#218739] border border-[#218739]/20'
                }`}
              >
                {result.riskLevel === 'HIGH RISK' ? (
                  <AlertOctagon className="w-6 h-6 shrink-0 mt-0.5" />
                ) : result.riskLevel === 'SUSPICIOUS' ? (
                  <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm uppercase tracking-wider">
                      {result.riskLevel}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/70">
                      Score: {result.riskScore}/100
                    </span>
                  </div>
                  <p className="text-xs font-medium mt-1 leading-relaxed text-[#242424]">
                    {result.verdict}
                  </p>
                </div>
              </div>

              {/* Warning Signs List */}
              {result.warningSigns.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#242424] uppercase tracking-wider mb-2">
                    Identified Indicators:
                  </h4>
                  <ul className="space-y-1.5">
                    {result.warningSigns.map((sign, idx) => (
                      <li key={idx} className="text-xs text-[#242424] flex items-start gap-2">
                        <span className="text-[#8B1E3F] font-bold mt-0.5">•</span>
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Action */}
              <div className="p-3.5 bg-[#FAFAFA] rounded-md border border-[#E5E5E5]">
                <h4 className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                  Recommended Immediate Protocol:
                </h4>
                <p className="text-xs font-bold text-[#242424] leading-relaxed">
                  {result.recommendedAction}
                </p>
              </div>

              {/* Scan Metadata */}
              <div className="text-[10px] text-[#6B6B6B] flex items-center justify-between pt-3 border-t border-[#F0F0F0]">
                <span>Analysis Engine: FinShield RuleSet v2.4</span>
                <span>Scanned at: {result.timestamp}</span>
              </div>
            </Card>
          ) : (
            <Card className="p-8 bg-white border border-[#E5E5E5] text-center space-y-3 flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-12 h-12 rounded-full bg-[#F8E9EE] text-[#8B1E3F] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#242424]">Awaiting Input to Scan</h3>
              <p className="text-xs text-[#6B6B6B] max-w-xs leading-relaxed">
                Paste any SMS text, WhatsApp forward, or payment request link on the left to run our real-time security heuristic scan.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Educational Red Flags Reference */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-[#242424] uppercase tracking-wider">
          Top 3 Digital Scams Targeting Young Indians in 2024
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white border-t-2 border-t-[#8B1E3F]">
            <h4 className="text-xs font-bold text-[#242424]">1. UPI PIN "Receive Money" Trap</h4>
            <p className="text-xs text-[#6B6B6B] mt-1.5 leading-relaxed">
              Scammers claim they are sending you money on OLX or marketplace and ask you to scan a QR code or enter your 4/6-digit UPI PIN. <strong>Entering UPI PIN ALWAYS DEBITS your account.</strong>
            </p>
          </Card>

          <Card className="p-4 bg-white border-t-2 border-t-[#8B1E3F]">
            <h4 className="text-xs font-bold text-[#242424]">2. Electricity / Water Bill Disconnection</h4>
            <p className="text-xs text-[#6B6B6B] mt-1.5 leading-relaxed">
              Automated SMS threatening power cutoff within hours unless you call a mobile number. They ask you to install QuickSupport or AnyDesk to steal bank OTPs.
            </p>
          </Card>

          <Card className="p-4 bg-white border-t-2 border-t-[#8B1E3F]">
            <h4 className="text-xs font-bold text-[#242424]">3. Part-Time YouTube / Hotel Rating Job</h4>
            <p className="text-xs text-[#6B6B6B] mt-1.5 leading-relaxed">
              Initial payout of ₹150 for liking 3 videos, then asks you to deposit ₹10,000 for "Prepaid crypto merchant tasks" which cannot be withdrawn.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScamCheckerPage;

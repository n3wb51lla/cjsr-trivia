import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react';
import { HostGate } from '../components/host/HostGate';
import './HostBrandPage.css';

type BrandPalette = {
  id: string;
  name: string;
  description: string;
  primary: string;
  accent: string;
  background: string;
  surface: string;
};

type BrandDraft = {
  triviaName: string;
  logoDataUrl: string | null;
  logoFileName: string | null;
  palette: BrandPalette;
};

type PreviewSurface = 'player' | 'projector';

const DRAFT_KEY = 'trivia-knight.host-brand-draft';
const MAX_LOGO_BYTES = 1024 * 1024;

const PALETTES: BrandPalette[] = [
  {
    id: 'knight',
    name: 'Knight gold',
    description: 'Confident, warm, and built for dark rooms.',
    primary: '#E3A838',
    accent: '#F6C85F',
    background: '#0B1120',
    surface: '#14203A',
  },
  {
    id: 'emerald',
    name: 'Emerald stage',
    description: 'Fresh contrast with a live-event feel.',
    primary: '#35C98F',
    accent: '#A7F3D0',
    background: '#071A18',
    surface: '#0E2924',
  },
  {
    id: 'violet',
    name: 'Electric violet',
    description: 'Playful energy with a sharp gold accent.',
    primary: '#8B5CF6',
    accent: '#F2C94C',
    background: '#120F24',
    surface: '#211A3B',
  },
];

const DEFAULT_DRAFT: BrandDraft = {
  triviaName: 'Friday Night General',
  logoDataUrl: null,
  logoFileName: null,
  palette: PALETTES[0],
};

export function HostBrandPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Brand setup | Trivia Knight';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <HostGate
      title="Unlock brand setup"
      description="Customize the name, logo, and color scheme used across your trivia night."
    >
      <BrandBuilder />
    </HostGate>
  );
}

function BrandBuilder() {
  const [draft, setDraft] = useState<BrandDraft>(readSavedDraft);
  const [previewSurface, setPreviewSurface] = useState<PreviewSurface>('player');
  const [message, setMessage] = useState('Changes are preview-only until you save this draft.');
  const [logoError, setLogoError] = useState<string | null>(null);

  const previewStyle = useMemo(() => ({
    '--brand-primary': draft.palette.primary,
    '--brand-accent': draft.palette.accent,
    '--brand-background': draft.palette.background,
    '--brand-surface': draft.palette.surface,
    '--brand-on-primary': readableTextColor(draft.palette.primary),
    '--brand-on-background': readableTextColor(draft.palette.background),
  }) as CSSProperties, [draft.palette]);

  function updatePalette(key: keyof Pick<BrandPalette, 'primary' | 'accent' | 'background' | 'surface'>, value: string) {
    setDraft(current => ({
      ...current,
      palette: { ...current.palette, id: 'custom', name: 'Custom palette', description: 'Your custom event colors.', [key]: value },
    }));
    setMessage('Unsaved color changes.');
  }

  function choosePalette(palette: BrandPalette) {
    setDraft(current => ({ ...current, palette }));
    setMessage(`${palette.name} selected. Save the draft when it feels right.`);
  }

  function handleLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setLogoError('Choose a PNG, JPEG, or WebP image.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Keep the logo under 1 MB so the local draft remains reliable.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      setDraft(current => ({ ...current, logoDataUrl: reader.result as string, logoFileName: file.name }));
      setLogoError(null);
      setMessage('Logo added to the preview. Save the draft to keep it on this device.');
    };
    reader.onerror = () => setLogoError('That logo could not be read. Try another file.');
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setDraft(current => ({ ...current, logoDataUrl: null, logoFileName: null }));
    setLogoError(null);
    setMessage('Logo removed from the preview.');
  }

  function saveDraft(event: FormEvent) {
    event.preventDefault();
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setMessage('Draft saved on this device. The live trivia app has not been changed.');
    } catch {
      setMessage('The draft could not be saved on this device. Your preview is still available in this tab.');
    }
  }

  function resetDraft() {
    setDraft(DEFAULT_DRAFT);
    setLogoError(null);
    window.localStorage.removeItem(DRAFT_KEY);
    setMessage('Brand setup reset to the Trivia Knight starter.');
  }

  return (
    <section className="brand-builder" aria-labelledby="brand-builder-title">
      <header className="brand-builder__header">
        <div>
          <p className="brand-builder__eyebrow">Host tools · Brand setup</p>
          <h1 id="brand-builder-title">Make the night yours.</h1>
          <p>Set the identity your teams will see on their phones and on the room display.</p>
        </div>
        <span className="brand-builder__local-badge">Local draft</span>
      </header>

      <div className="brand-builder__notice" role="note">
        <strong>Safe to test.</strong> This builder does not publish changes or connect to the live event.
      </div>

      <div className="brand-builder__layout">
        <form className="brand-builder__form" onSubmit={saveDraft}>
          <fieldset className="brand-builder__section">
            <legend><span>01</span> Trivia identity</legend>
            <label htmlFor="trivia-name">Trivia name</label>
            <input
              id="trivia-name"
              value={draft.triviaName}
              maxLength={60}
              onChange={event => {
                setDraft(current => ({ ...current, triviaName: event.target.value }));
                setMessage('Unsaved name change.');
              }}
              placeholder="Friday Night General"
              required
            />
            <div className="brand-builder__field-meta">
              <span>This appears on the player and projector screens.</span>
              <span>{draft.triviaName.length}/60</span>
            </div>
          </fieldset>

          <fieldset className="brand-builder__section">
            <legend><span>02</span> Event logo</legend>
            <div className="brand-builder__upload-row">
              <div className="brand-builder__logo-well" aria-label="Current logo preview">
                {draft.logoDataUrl ? <img src={draft.logoDataUrl} alt="Uploaded event logo preview" /> : <LogoFallback triviaName={draft.triviaName} />}
              </div>
              <div>
                <label className="brand-builder__upload" htmlFor="brand-logo">Choose logo</label>
                <input id="brand-logo" className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogo} />
                <p>PNG, JPEG, or WebP · maximum 1 MB</p>
                {draft.logoFileName && <p className="brand-builder__filename">{draft.logoFileName}</p>}
                {draft.logoDataUrl && <button className="brand-builder__text-button" type="button" onClick={removeLogo}>Remove logo</button>}
              </div>
            </div>
            {logoError && <p className="brand-builder__error" role="alert">{logoError}</p>}
          </fieldset>

          <fieldset className="brand-builder__section">
            <legend><span>03</span> Color scheme</legend>
            <div className="brand-builder__palettes">
              {PALETTES.map(palette => {
                const selected = draft.palette.id === palette.id;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    className={selected ? 'brand-builder__palette is-selected' : 'brand-builder__palette'}
                    aria-pressed={selected}
                    onClick={() => choosePalette(palette)}
                  >
                    <span className="brand-builder__swatches" aria-hidden="true">
                      <i style={{ background: palette.primary }} />
                      <i style={{ background: palette.accent }} />
                      <i style={{ background: palette.background }} />
                    </span>
                    <strong>{palette.name}</strong>
                    <small>{palette.description}</small>
                  </button>
                );
              })}
            </div>
            <div className="brand-builder__color-grid">
              <ColorField label="Primary" value={draft.palette.primary} onChange={value => updatePalette('primary', value)} />
              <ColorField label="Accent" value={draft.palette.accent} onChange={value => updatePalette('accent', value)} />
              <ColorField label="Background" value={draft.palette.background} onChange={value => updatePalette('background', value)} />
              <ColorField label="Surface" value={draft.palette.surface} onChange={value => updatePalette('surface', value)} />
            </div>
          </fieldset>

          <div className="brand-builder__actions">
            <button className="brand-builder__save" type="submit">Save draft locally</button>
            <button className="brand-builder__reset" type="button" onClick={resetDraft}>Reset</button>
          </div>
          <p className="brand-builder__status" role="status" aria-live="polite">{message}</p>
        </form>

        <aside className="brand-builder__preview-panel" aria-label="Live brand preview">
          <div className="brand-builder__preview-heading">
            <div>
              <p>Live preview</p>
              <strong>{previewSurface === 'player' ? 'Team device' : 'Room display'}</strong>
            </div>
            <div className="brand-builder__preview-tabs" role="group" aria-label="Preview surface">
              <button type="button" aria-pressed={previewSurface === 'player'} onClick={() => setPreviewSurface('player')}>Player</button>
              <button type="button" aria-pressed={previewSurface === 'projector'} onClick={() => setPreviewSurface('projector')}>Projector</button>
            </div>
          </div>
          <div className={`brand-preview brand-preview--${previewSurface}`} style={previewStyle}>
            <div className="brand-preview__topbar">
              {draft.logoDataUrl ? <img src={draft.logoDataUrl} alt="" /> : <LogoFallback triviaName={draft.triviaName} compact />}
              <span>{draft.triviaName || 'Untitled trivia'}</span>
            </div>
            {previewSurface === 'player' ? <PlayerPreview /> : <ProjectorPreview />}
          </div>
          <dl className="brand-builder__checklist">
            <div><dt>Name</dt><dd>{draft.triviaName.trim() ? 'Ready' : 'Needed'}</dd></div>
            <div><dt>Logo</dt><dd>{draft.logoDataUrl ? 'Uploaded' : 'Text fallback'}</dd></div>
            <div><dt>Contrast</dt><dd>Auto checked</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="brand-builder__color-field">
      <span>{label}</span>
      <span className="brand-builder__color-control">
        <input type="color" value={value} onChange={event => onChange(event.target.value.toUpperCase())} aria-label={`${label} color`} />
        <code>{value.toUpperCase()}</code>
      </span>
    </label>
  );
}

function LogoFallback({ triviaName, compact = false }: { triviaName: string; compact?: boolean }) {
  const letters = triviaName.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase() || 'TK';
  return <span className={compact ? 'brand-builder__logo-fallback is-compact' : 'brand-builder__logo-fallback'} aria-hidden="true">{letters}</span>;
}

function PlayerPreview() {
  return (
    <div className="brand-preview__player">
      <div className="brand-preview__meta"><span>ROUND 1 · QUESTION 4</span><strong>00:18</strong></div>
      <p>Which city hosted the first modern Olympic Games in 1896?</p>
      <div className="brand-preview__answers">
        <span>A <strong>Paris</strong></span>
        <span className="is-selected">B <strong>Athens</strong></span>
        <span>C <strong>Rome</strong></span>
        <span>D <strong>London</strong></span>
      </div>
      <button type="button" tabIndex={-1}>Lock in answer</button>
    </div>
  );
}

function ProjectorPreview() {
  return (
    <div className="brand-preview__projector">
      <span>ROUND 1 · QUESTION 4</span>
      <p>Which city hosted the first modern Olympic Games in 1896?</p>
      <div><strong>14</strong> of 18 teams locked in</div>
    </div>
  );
}

function readSavedDraft(): BrandDraft {
  try {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (!saved) return DEFAULT_DRAFT;
    const parsed = JSON.parse(saved) as Partial<BrandDraft>;
    if (typeof parsed.triviaName !== 'string' || !parsed.palette) return DEFAULT_DRAFT;
    return {
      triviaName: parsed.triviaName,
      logoDataUrl: typeof parsed.logoDataUrl === 'string' ? parsed.logoDataUrl : null,
      logoFileName: typeof parsed.logoFileName === 'string' ? parsed.logoFileName : null,
      palette: parsed.palette,
    };
  } catch {
    return DEFAULT_DRAFT;
  }
}

function readableTextColor(hex: string) {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? '#101827' : '#FFFFFF';
}

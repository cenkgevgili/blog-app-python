import re
import unicodedata

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    # Turkish character mapping
    tr_map = {
        'ı': 'i', 'İ': 'i', 'ğ': 'g', 'Ğ': 'g',
        'ü': 'u', 'Ü': 'u', 'ş': 's', 'Ş': 's',
        'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c'
    }
    for tr, en in tr_map.items():
        text = text.replace(tr, en)
    
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')

def calculate_read_time(content: str) -> str:
    """Calculate estimated reading time."""
    words = len(content.split())
    minutes = max(1, round(words / 200))
    return f"{minutes} dk"

def generate_excerpt(content: str, max_length: int = 160) -> str:
    """Generate excerpt from content."""
    # Remove markdown
    text = re.sub(r'#+ ', '', content)
    text = re.sub(r'\*\*|__', '', text)
    text = re.sub(r'\*|_', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = re.sub(r'```[\s\S]*?```', '', text)
    text = re.sub(r'`[^`]+`', '', text)
    text = ' '.join(text.split())
    
    if len(text) <= max_length:
        return text
    return text[:max_length].rsplit(' ', 1)[0] + '...'

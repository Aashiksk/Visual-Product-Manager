# utils.py
from PIL import Image
import imagehash

def compute_phash_from_pil(pil_image: Image.Image) -> int:
    """
    Return integer representation of phash (64-bit).
    """
    ph = imagehash.phash(pil_image)  # imagehash.ImageHash object
    return int(str(ph), 16)

def phash_to_hex(phash_int: int) -> str:
    return format(phash_int, "016x")

def hamming_distance(a: int, b: int) -> int:
    x = a ^ b
    return x.bit_count()

"""Original musical/cue arc, retimed to the connected v3 edit."""
import importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location('score',Path(__file__).with_name('revision-sound.py'))
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.render('full-v3.wav',120,[(0,440),(6,554.365),(12,659.255),(16.55,440),(22.78,659.255),(26.2,440),(27.1,554.365),(28,659.255),(28.9,830.609),(33,329.628),(41,554.365),(48.96,659.255),(51,880),(56.8,329.628),(61,440),(63,554.365),(72,659.255),(84,440),(88,659.255),(93,554.365),(96,880),(105.2,659.255),(107,830.609),(110.5,880),(110.65,1108.73),(110.8,1318.51),(114.8,659.255)])

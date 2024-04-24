type CallOpenFileModalProps = {
  changeEvent: (this: HTMLInputElement, ev: HTMLElementEventMap['input']) => void;
  cancelEvent?: (this: HTMLInputElement, ev: HTMLElementEventMap['input']) => void;
};

const callOpenFileModal = (props: CallOpenFileModalProps) => {
  const f = document.createElement('input');
  f.style.display = 'none';
  f.type = 'file';
  f.name = 'file';
  f.addEventListener('change', props.changeEvent);
  if (props.cancelEvent) {
    f.addEventListener('cancel', props.cancelEvent);
  }

  document.getElementById('root')!.appendChild(f);
  f.click();
};

export default callOpenFileModal;

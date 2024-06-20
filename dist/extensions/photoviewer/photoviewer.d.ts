import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import PhotoViewer from 'photoviewer';
import * as i0 from '@angular/core';
export declare class MtxPhotoviewer implements OnInit, OnDestroy {
  private _elementRef;
  images: PhotoViewer.Img[];
  options?: PhotoViewer.Options;
  embed: boolean;
  photoviewerInstance?: PhotoViewer;
  constructor(_elementRef: ElementRef<Element>);
  ngOnInit(): void;
  ngOnDestroy(): void;
  onClick(event: MouseEvent): void;
  initPhotoViewer(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<MtxPhotoviewer, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    MtxPhotoviewer,
    '[mtxPhotoviewer]',
    ['mtxPhotoviewer'],
    {
      images: { alias: 'mtxPhotoviewerItems'; required: false };
      options: { alias: 'mtxPhotoviewerOptions'; required: false };
      embed: { alias: 'mtxPhotoviewerEmbed'; required: false };
    },
    {},
    never,
    never,
    true,
    never
  >;
  static ngAcceptInputType_embed: unknown;
}

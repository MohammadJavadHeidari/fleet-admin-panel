import type { Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { layoutClasses } from '../core/classes';
import { MainSection } from '../core/main-section';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';

import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MobileLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export function MobileLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'sm',
}: MobileLayoutProps) {
  const theme = useTheme();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: 'sm',
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: null, 
      // leftArea: (
      //   <>
      //     {/** @slot Nav mobile */}
      //     <MenuButton
      //       onClick={onOpen}
      //       sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
      //     />
      //     {/* <NavMobile data={navData} open={open} onClose={onClose} workspaces={_workspaces} /> */}
      //   </>
      // ),
      rightArea: null,

      // rightArea: (
      //   <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
      //     {/** @slot Searchbar */}
      //     {/* <Searchbar /> */}

      //     {/** @slot Language popover */}
      //     {/* <LanguagePopover data={_langs} /> */}

      //     {/** @slot Notifications popover */}
      //     {/* <NotificationsPopover data={_notifications} /> */}

      //     {/** @slot Account drawer */}
      //     <AccountPopover data={_account} />
      //   </Box>
      // ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
    // /** **************************************
    //  * @Header
    //  *************************************** */
    // headerSection={renderHeader()}
    // /** **************************************
    //  * @Footer
    //  *************************************** */
    // footerSection={renderFooter()}
    // /** **************************************
    //  * @Styles
    //  *************************************** */
    sx={[
      {
        [`& .${layoutClasses.sidebarContainer}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
            transition: theme.transitions.create(['padding-left'], {
              easing: 'var(--layout-transition-easing)',
              duration: 'var(--layout-transition-duration)',
            }),
          },
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}

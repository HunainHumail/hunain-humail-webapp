import { Container, Heading } from "@/components/atoms";
import { SiteTemplate } from "@/components/templates";
import { getSiteSettings } from "@/services/siteSettings";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <SiteTemplate settings={settings}>
      <Container as="section" className="flex flex-1 flex-col justify-center py-16">
        <Heading level={1} size="display">Hunain Humail</Heading>
      </Container>
    </SiteTemplate>
  );
}

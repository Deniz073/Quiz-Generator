import type { Chapter } from '../types'

export const chapter06: Chapter = {
  id: '6-storage-services',
  number: 6,
  title: 'Azure storage services',
  questions: [
    {
      question:
        'What does an Azure Storage account provide for your Azure Storage data?',
      options: [
        'A dedicated physical server that hosts all of your data',
        'A unique namespace that is accessible worldwide over HTTP or HTTPS',
        'A private network that is only reachable from on-premises',
        'A virtual machine image that stores your data in a VHD file',
      ],
      correctIndex: 1,
      explanation:
        'A storage account is a unique namespace for your Azure Storage data, reachable from anywhere over HTTP or HTTPS. It is a logical container, not a dedicated server or a private network.',
    },
    {
      question:
        'How does locally redundant storage (LRS) protect your data, and what is its main limitation?',
      options: [
        'It copies the data to a second region, but only for read access',
        'It copies the data to three availability zones, but costs the most',
        'It copies the data three times within a single datacenter, so a datacenter-wide disaster can cause data loss',
        'It keeps one copy per region, but it cannot be used for blobs',
      ],
      correctIndex: 2,
      explanation:
        'LRS replicates data three times inside one datacenter in the primary region. It is the cheapest option with the lowest durability (at least 11 nines), so Microsoft recommends ZRS, GRS or GZRS when you need more protection.',
    },
    {
      question:
        'An application needs high availability in the primary region. Reads and writes must keep working even if one datacenter (zone) becomes unavailable. Which redundancy option fits best?',
      options: [
        'Locally redundant storage (LRS)',
        'Geo-redundant storage (GRS)',
        'Archive storage',
        'Zone-redundant storage (ZRS)',
      ],
      correctIndex: 3,
      explanation:
        'ZRS replicates synchronously across three availability zones in the primary region, so data stays readable and writable when a zone fails. LRS keeps everything in one datacenter, and GRS has only one datacenter-level copy set in the primary region.',
    },
    {
      question:
        'A company wants its data replicated across three availability zones in the primary region and also copied to a secondary region to survive a regional disaster. Which redundancy option should it choose?',
      options: [
        'Geo-zone-redundant storage (GZRS)',
        'Zone-redundant storage (ZRS)',
        'Geo-redundant storage (GRS)',
        'Locally redundant storage (LRS)',
      ],
      correctIndex: 0,
      explanation:
        'GZRS combines ZRS in the primary region with asynchronous replication to a secondary region. GRS also uses a second region, but its primary-region copies live in a single datacenter (LRS), so it gives no zone-level availability.',
    },
    {
      question:
        'An application must be able to read data from the secondary region at any time, even while the primary region is fully operational. What should you enable?',
      options: [
        'Zone-redundant storage (ZRS)',
        'Geo-redundant storage (GRS) without any other settings',
        'Read-access geo-redundant storage (RA-GRS)',
        'The Cool access tier',
      ],
      correctIndex: 2,
      explanation:
        'With GRS or GZRS, secondary-region data is normally not readable unless a failover happens. Read-access (RA-GRS or RA-GZRS) makes the secondary readable at all times.',
    },
    {
      question:
        'An administrator wants to choose which Azure region a GRS storage account replicates its data to. What is the situation?',
      options: [
        'Any region can be chosen at account creation, but not changed afterwards',
        'The secondary region is determined by the Azure region pair and cannot be changed',
        'The secondary region is always the region closest to the primary region',
        'The secondary region can be changed at any time in the portal',
      ],
      correctIndex: 1,
      explanation:
        'The secondary region is the paired region of the primary region (Azure region pairs), typically hundreds of kilometers away. You cannot pick a different one.',
    },
    {
      question:
        'Which Azure Storage service is a highly scalable object store for unstructured text and binary data, for example for streaming video or serving images directly to a browser?',
      options: [
        'Azure Queue Storage',
        'Azure Files',
        'Azure Blob Storage',
        'Azure Disks',
      ],
      correctIndex: 2,
      explanation:
        'Blob Storage stores unstructured objects with no restrictions on data type and suits streaming, backup, archiving and serving files to browsers. Azure Files offers file shares and Queue Storage handles messages.',
    },
    {
      question:
        'Data in Blob Storage is rarely accessed, will be kept for at least 180 days and can tolerate flexible latency. Which access tier gives the lowest storage cost?',
      options: [
        'Hot access tier',
        'Cool access tier',
        'Premium access tier',
        'Archive access tier',
      ],
      correctIndex: 3,
      explanation:
        'The Archive tier is meant for rarely accessed data kept at least 180 days, with the lowest storage cost. The Cool tier is for infrequently accessed data kept at least 30 days.',
    },
    {
      question:
        'Which statement about the Blob Storage Archive access tier is correct?',
      options: [
        'It can be set as the default tier at storage account level',
        'It stores data offline, has the lowest storage cost and the highest retrieval cost',
        'It offers the fastest access to frequently used data',
        'It has no minimum storage duration',
      ],
      correctIndex: 1,
      explanation:
        'Archive data is stored offline: cheapest to store, most expensive to retrieve. Unlike Hot and Cool, Archive cannot be set at account level, only on individual blobs.',
    },
    {
      question:
        'Which access tier is optimized for data that is infrequently accessed and stored for at least 30 days, with slightly lower availability and higher access costs than the Hot tier?',
      options: [
        'Locally redundant tier',
        'Hot access tier',
        'Archive access tier',
        'Cool access tier',
      ],
      correctIndex: 3,
      explanation:
        'The Cool tier targets infrequently used data kept at least 30 days and trades lower storage cost for a slightly lower availability SLA and higher access costs. Hot is for frequently used data.',
    },
    {
      question:
        'A company wants to lift and shift its on-premises file shares to Azure without changing applications that use the SMB protocol. Which Azure Storage service should it use?',
      options: [
        'Azure Queue Storage',
        'Azure Blob Storage',
        'Azure Files',
        'Azure Disks',
      ],
      correctIndex: 2,
      explanation:
        'Azure Files offers fully managed file shares accessible over SMB or NFS, so on-premises shares can migrate without compatibility concerns. Blob Storage is an object store, not a file share.',
    },
    {
      question:
        'Two application components must exchange messages reliably, and an Azure Function should process them. Which Azure Storage service is designed for this?',
      options: [
        'Azure Blob Storage',
        'Azure Files',
        'Azure Disks',
        'Azure Queue Storage',
      ],
      correctIndex: 3,
      explanation:
        'Queue Storage stores large numbers of messages (up to 64 KB each) for reliable messaging between application components and can be combined with Azure Functions.',
    },
    {
      question:
        'Which Azure Storage service provides block-level storage volumes for Azure virtual machines?',
      options: [
        'Azure Files',
        'Azure Disks',
        'Azure Queue Storage',
        'Azure Blob Storage',
      ],
      correctIndex: 1,
      explanation:
        'Azure Disks are managed, virtualized disks for VMs. Because they are virtualized they are more resilient and available than a physical disk, and you only provision the disk.',
    },
    {
      question:
        'A company wants a single hub in the Azure portal to discover, assess and migrate its on-premises servers, databases and web apps to Azure. Which service should it use?',
      options: [
        'AzCopy',
        'Azure Migrate',
        'Azure File Sync',
        'Azure Storage Explorer',
      ],
      correctIndex: 1,
      explanation:
        'Azure Migrate is the unified hub for assessing and migrating on-premises infrastructure, apps and data. AzCopy, Storage Explorer and File Sync only move files or blobs.',
    },
    {
      question:
        'A company must move many terabytes of data to Azure, but its network connection is too slow. Which service ships a physical storage device (up to 80 TB) that is uploaded to Azure once Microsoft receives it?',
      options: ['Azure Migrate', 'AzCopy', 'Azure Data Box', 'Azure File Sync'],
      correctIndex: 2,
      explanation:
        'Azure Data Box is an offline, physical migration service: you order it in the Azure portal, fill it with data and ship it back for upload. Azure Migrate and AzCopy transfer over the network.',
    },
    {
      question:
        'A company wants to centralize its file shares in Azure Files while keeping the performance and compatibility of an on-premises Windows file server. Which tool should it use?',
      options: [
        'Azure Data Box',
        'AzCopy',
        'Azure Storage Explorer',
        'Azure File Sync',
      ],
      correctIndex: 3,
      explanation:
        'Azure File Sync centralizes file shares in Azure Files and keeps a Windows file server experience on-premises. AzCopy is a command-line copy tool and Storage Explorer is a GUI for managing blobs and files.',
    },
    {
      question:
        'An administrator wants a command-line tool to upload, download, copy and synchronize blobs and files to and from a storage account. Which tool should be used?',
      options: [
        'Azure Storage Explorer',
        'Azure Data Box',
        'AzCopy',
        'Azure Migrate',
      ],
      correctIndex: 2,
      explanation:
        'AzCopy is a command-line utility for copying blobs and files to, from and between storage accounts. Azure Storage Explorer does similar work but is a standalone GUI app.',
    },
    {
      question:
        'Which three Azure Storage redundancy options copy your data to a secondary region? Select three.',
      options: [
        'Locally redundant storage (LRS)',
        'Geo-redundant storage (GRS)',
        'Zone-redundant storage (ZRS)',
        'Geo-zone-redundant storage (GZRS)',
        'Read-access geo-redundant storage (RA-GRS)',
      ],
      correctIndexes: [1, 3, 4],
      explanation:
        'GRS, GZRS and their read-access variants replicate asynchronously to a secondary region. LRS and ZRS only keep copies within the primary region, in a single datacenter or across availability zones respectively.',
    },
    {
      question:
        'Which two statements about Azure Files are correct? Select two.',
      options: [
        'Azure Files shares can be accessed over the SMB and NFS protocols',
        'Azure Files provides block-level volumes that are attached to virtual machines as disks',
        'Azure Files shares can only be mounted by virtual machines running inside Azure, not by on-premises computers',
        'You can create file shares without managing any hardware or operating system',
      ],
      correctIndexes: [0, 3],
      explanation:
        'Azure Files is a fully managed file share service that supports industry-standard SMB and NFS. Block-level volumes for VMs are Azure Disks, and Azure Files shares can also be mounted from on-premises machines.',
    },
  ],
}
